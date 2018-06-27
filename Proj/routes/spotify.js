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

mongoose.connect('mongodb://localhost/spotiFeelz');
// Get Mongoose to use the global promise library
mongoose.Pormise = global.Promise;
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

const playlistCompSchema = new Schema ({
    spot_uname: {type: String, required: true},
    playlistId: {type: String, required: true, unique: true},
    name: String,
    feels: String,
    gif: String,
});

const playlist = mongoose.model('playlist', playlistCompSchema);

const client_id = config.spotify.client_id; // Your client id
const client_secret = config.spotify.client_secret; // Your secret
const redirect_uri = config.spotify.callback; // Your redirect uri


router.post("/addPlaylistComp", function(req, res) {
    let aPlaylist = new playlist(
        req.body
    );
    aPlaylist.save(function(err) {
        if (err) {res.send(err); }
        else {res.send (aPlaylist)}
    })
});

router.get("/getPlaylistCompById/:playlistid", function(req, res) {
    let query = playlist.findOne({ 'playlistId': req.param('playlistid')});
    query.exec(function (err, playlistResult) {
        console.log(err);
        if (err){
            console.log("ERROR");
            return handleError(err);
        }
        res.json (playlistResult);
    })
});

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
            //console.log(payload);

            let watOptions = {
                url: "http://localhost:3000/watson/getmood",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                form:{"text":payload}
            };

            request.post(watOptions, function(error, response, body){
                let feel = JSON.parse(body);
                let giphyOptions = {
                    url: 'https://api.giphy.com/v1/gifs/search?api_key='+config.giphy.apikey+'&q='+feel
                };
                request.get(giphyOptions, function (error, response, body) {
                    let jason = JSON.parse(body);

                    let gif = jason.data[Math.floor((Math.random() * 5) + 1)].images.original.url;
                    let dbOptions = {
                        url: "http://localhost:3000/addPlaylistComp",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        form:{spot_uname: MyID,
                            playlistId: playlistid,
                            name: "",
                            feels: feel,
                            gif: gif,}
                    };
                    res.send({feel: feel, gif: gif});

                    request.post(dbOptions, function (error, response, body) {
                        if(error){
                            console.log("Adding to DB was unsuccessful")
                        }
                        else{

                        }

                    });
                })


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
                                            res.redirect('http://localhost:4200/user/'+newUser.spot_uname)
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