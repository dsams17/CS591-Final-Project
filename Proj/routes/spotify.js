const express = require('express');
const querystring = require('querystring');
const mongoose = require('mongoose');
const fs = require('fs');
const router = express.Router();
const request = require('request');

const Transform = require('stream').Transform;
const parser = new Transform();
const config = require("./config/config");

const user = mongoose.model('user');

const client_id = config.spotify.client_id; // Your client id
const client_secret = config.spotify.client_secret; // Your secret
const redirect_uri = config.spotify.callback; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
let stateKey = 'spotify_auth_state';

router.get('/getmood/:myspotify/:playlistid', function(req, res){
    let response1 = "";
    const MyID = req.param('myspotify');
    const playlistid = req.param('playlistid');
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        //console.log(body);
        let token = body.access_token;


        // use the access token to access the Spotify Web API

        let options = {
            url: "https://api.spotify.com/v1/users/"+MyID+"/playlists/"+playlistid,
            headers: {

                "Authorization": 'Bearer ' + token

            },
            json: true

        };
        request.get(options, function(error, response, body) {
            let payload = "";
            for(i = 0; i< body.tracks.items.length; i++){
                payload += body.tracks.items[i].track.name;
                payload += " ";
            }
            console.log(payload);

            let watOptions = {
                url: "http://localhost:3000/watson/getmood",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                form:{"text":payload}
            };

            request.post(watOptions, function(error, response, body){
                res.send(body);

            })
        })

    })

});

router.get('/getplaylists/:myspotify', function(req, res) {
    let response1 = "";
    const MyID = req.param('myspotify');
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        //console.log(body);
        let token = body.access_token;


        // use the access token to access the Spotify Web API

        let options = {
            url: "https://api.spotify.com/v1/users/"+MyID+"/playlists",
            headers: {

                "Authorization": 'Bearer ' + token

            },
            json: true

        };
        request.get(options, function(error, response, body) {

            let payload = [];
            response1 = body.items;

            for(i = 0; i<response1.length; i++){
                let obj = {
                    id: i,
                    playlistName: response1[i].name,
                    playlistId: response1[i].id,
                    feels: {sentiment:"",gif:""}
                };
                payload.push(obj);
            }


        res.send(payload);
        })


    })
});

router.get('/getplaylistcompatability/:myspotify/:theirspotify', function(req, res) {
    let compatibilityNumeral = 0;
    let total = 0;
    let compDict = {};
    let response1 = "";
    let response2 = "";
    const MyID = req.param('myspotify');
    const TheirID = req.param('theirspotify');
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };
    request.post(authOptions, function(error, response, body) {
        //console.log(body);
        let token = body.access_token;


        // use the access token to access the Spotify Web API

        let options = {
            url: "https://api.spotify.com/v1/users/"+MyID+"/playlists?limit=1",
            headers: {

                "Authorization": 'Bearer ' + token

            },
            json: true

        };

        request.get(options, function(error, response, body) {
            //console.log(body);
            //console.log(body.items[0].id);
            response1 = body.items[0].href;

            let options3 = {
                url: response1,
                json: true,
                headers: {
                    ///"Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                    //"Accept": "application/json"
                }

            };

            request.get(options3, function(error, response, body) {
                //console.log(response1+"?fields=items(track(artists,name))");
                let Jbody =JSON.parse(JSON.stringify(body));
                //console.log(Jbody);
                //console.log(Jbody.tracks.items[0].track.artists[0].name);
                for(var key in Jbody.tracks.items){
                    total++;
                    compDict[Jbody.tracks.items[key].track.name] = Jbody.tracks.items[key].track.artists[0].name;
                }
                //console.log(compDict);

                let options2 = {
                    url: "https://api.spotify.com/v1/users/"+TheirID+"/playlists?limit=1",
                    headers: {
                        //"Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                        //"Accept": "application/json"
                    },
                    json:true
                };
                request.get(options2, function(error, response, body) {

                    response2 = body.items[0].href;


                    let options4 = {
                        url: response2,
                        json: true,
                        headers: {
                            //"Content-Type": "application/json",
                            "Authorization": "Bearer " + token
                            //"Accept": "application/json"
                        }

                    };

                    request.get(options4, function(error, response, body) {
                        let Jbody =JSON.parse(JSON.stringify(body));
                        //console.log(compDict);
                        for(var key in Jbody.tracks.items){
                            if (Jbody.tracks.items[key].track.name in compDict){
                                if (Jbody.tracks.items[key].track.artists[0].name === compDict[Jbody.tracks.items[key].track.name]){

                                    compatibilityNumeral++;
                                }
                            }
                        }
                        res.json((compatibilityNumeral/total)*100);
                        //response.send((total/compatibilityNumeral)*100);
                    });


                });
            });


        });








    });


    console.log(compatibilityNumeral);

});


router.get('/login', function(req, res) {

    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

router.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;


    res.clearCookie(stateKey);
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };



    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            let access_token = body.access_token,
                refresh_token = body.refresh_token;
            let userModel = {};


            let options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function (tokenerror, response, body) {
                if (tokenerror || body === null || Object.keys(body).length === 0) {
                    res.send(tokenerror);
                } else {
                    let query = user.findOne({'spot_uname': response.body.id});
                    query.exec(function (err, userResult) {
                        if (err) return handleError(err);
                        if (userResult === null || Object.keys(userResult).length === 0) {
                            console.log('not a user');
                            // user not in our database
                            let newUser = {
                                'spot_uname': response.body.id.trim(),
                                'refresh_token': refresh_token.trim(),
                                'access_token': access_token.trim(),
                                'name': response.body.display_name.trim(),
                                'email': response.body.email.trim()
                            };
                            //console.log(newUser);
                            //add user to database
                            aUser = new user(
                                newUser
                            );

                            aUser.save(function(createUserError) {
                                if (createUserError) {
                                    console.log(createUserError);
                                    res.status(500).send(createUserError);
                                }
                                else {
                                    console.log('user ' + newUser.name + ' created');
                                    fs.readFile(__dirname + '/../frontend/src/index.html', 'utf-8', function(err, data){
                                        if (err){
                                            console.log(err);
                                            res.status(500).send(err);
                                        } else {
                                            let htmlResponse = appendData(data, aUser);
                                            res.set('Content-Type', 'text/html');
                                            res.status(200).send(htmlResponse);
                                        }
                                    });
                                }
                            })
                        } else {
                            console.log("user " + userResult.name + " database");
                            // the user is in the database!
                            fs.readFile(__dirname + '/../frontend/src/index.html', 'utf-8', function(err, data){
                                if (err){
                                    console.log(err);
                                    res.status(500).send(err);
                                } else {
                                    let htmlResponse = appendData(data, userResult);
                                    res.set('Content-Type', 'application/json');
                                    //res.status(200).send(htmlResponse);
                                    //res.status(200).send(userResult);
                                    //let existwindow = window.open("",'Spotify');
                                    //sessionStorage.setItem('spotify-uname', userResult.spot_uname);
                                    res.redirect('http://localhost:4200/user/'+userResult.spot_uname)
                                }
                            });
                        }
                    })
                }
            });
        } else {
            res.redirect(301, 'http://localhost:3000/')
        }
    });

});

router.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

let appendData = function(html, data) {
    return html.replace('var userdata = {};', 'var userdata = \'' + JSON.stringify(data) + '\';');
};

module.exports = router;