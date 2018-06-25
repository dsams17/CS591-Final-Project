
///////////////////////////////////////////////////
//                  model                        //
///////////////////////////////////////////////////

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/spotiFeelz');
// Get Mongoose to use the global promise library
mongoose.Pormise = global.Promise;
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

const comparisonSchema = new Schema ({
    run_by: {type: String, required: true },      //id of user who ran a job
    run_against: {type: String, required: true },   //spotify username of person job run against
    score: Number,
    gif_link: String,
    date_run: {type: Date, default: Date.now}
});

const comparison = mongoose.model('comparison', comparisonSchema);

///////////////////////////////////////////////////////
//                  controllers                      //
///////////////////////////////////////////////////////

exports.create = function(req, res) {
    console.log(req.body);
    let data = JSON.parse(req.body.value);
    console.log(data);

    let aComparison = new comparison(
        data
        )
    ;
    aComparison.save(function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send (aComparison)}
    })
};

exports.getAllByUserID = function(req,res) {
    let query = comparison.find({ 'run_by': req.param('id')});
    query.exec(function (err, compResult) {
        if (err) return handleError(err);
        res.json (compResult);
    })
};

exports.getBySpotiUser = function(req, res) {
    console.log(req.params._id);
    console.log(req.params.spot_uname);
    let query = comparison.find({ 'run_by': req.params._id, 'run_against': req.params.spot_uname }).sort({"date_run":-1});
    query.exec(function (err, compResult){
        if (err) res.send(500, err);
        res.json (compResult);
    })
};

exports.deleteComparison = function(req, res, next ) {
    comparison.findByIdAndRemove(req.params.id, function (err, result) {
        if(err) {res.json({message: 'Error deleting'});}
        else {res.json({message: 'success', "result": result});}
    })
};