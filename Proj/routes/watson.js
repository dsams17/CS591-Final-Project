const express = require('express');
const router = express.Router();
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const config = require("./config/config");



router.post('/getmood', function(req, res) {
    let toneAnalyzer = new ToneAnalyzerV3({
        'version': "2017-09-21",
        iam_apikey: config.watson.apikey,
        'url':"https://gateway-wdc.watsonplatform.net/tone-analyzer/api"
    });

    let toneParams = {
        'tone_input': {'text': req.body.text},
        'content_type': 'application/json',
        'sentences': false

    };
    //console.log(toneAnalyzer);
    //console.log(toneParams);

    toneAnalyzer.tone(toneParams, function (error, analysis) {
        if (error) {
            res.send(error);
        } else {
            console.log(analysis);
            let r = analysis.document_tone.tones;
            if (r.length > 0) {
                max = [0, ""];
                for (i = 0; i < r.length; i++) {
                    scr = r[i].score;
                    if (scr > max[0]) {
                        max[0] = scr;
                        max[1] = r[i].tone_name;
                    }
                }
                res.json(max[1]);
            } else {
                res.json("Sloth")
            }


            //let l = r.document_tone[0];

        }
    });
     });

module.exports = router;