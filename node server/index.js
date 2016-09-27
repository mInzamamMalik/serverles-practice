var express          = require("express");
var mongoose         = require("mongoose");
var app = express();
app.set('port', (process.env.PORT || 3000));


mongoose.connect(dbURI);





var dbURI = 'mongodb://localhost/mydatabase';
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String, //this will contain company identification of which this order is related
    password: String, // this will contain sale man identification who is placing this order    
});
var user = mongoose.model("users", userSchema);

var newUser = new user({
    username: "username",
    password: "password"
});

newUser.save(function(err, data) {
    console.log("error: ", err);
    console.log("data: ", data);
});













app.listen(app.get("port"), ()=> {
    console.log('app is running on port', app.get('port'));
});
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});