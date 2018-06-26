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

const userSchema = new Schema ({
    spot_uname: {type: String, required: true, unique: true},
    access_token: String,
    refresh_token: String,
    name: String,                        //name: optional
    email: {type: String, unique: true}   //email: optional, but must be unique
});

const user = mongoose.model('user', userSchema);


///////////////////////////////////////////////////////
//                  controllers                      //
///////////////////////////////////////////////////////

exports.addUser = function(req, res) {
    aUser = new user(
        req.body
    );
    aUser.save(function(err) {
        if (err) {res.send(err); }
        else {res.send (aUser)}
    })
};

exports.getUserbyUname = function(req, res) {
    let query = user.findOne({ 'spot_uname': req.param('uname')});
    query.exec(function (err, userResult) {
        if (err) return handleError(err);
        res.json (userResult);
    })
};

exports.deleteUser = function(req, res, next ) {
    user.findByIdAndRemove(req.params.id, function (err, result) {
        if(err) {res.json({message: 'Error deleting'});}
        else {res.json({message: 'success', "result": result});}
    })
};