var mongoose = require("mongoose");
var Schema = mongoose.Schema;

exports.userSchema = new Schema({
    username: String, //this will contain company identification of which this order is related
    password: String, // this will contain sale man identification who is placing this order    
});