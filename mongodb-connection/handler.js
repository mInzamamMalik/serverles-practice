'use strict';

var mongoose = require("mongoose");
var dbURI = "mongodb://testuser:testuser@ds041536.mlab.com:41536/inztest";
//var dbURI = 'mongodb://localhost/mydatabase';

mongoose.connect(dbURI);
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String, //this will contain company identification of which this order is related
    password: String, // this will contain sale man identification who is placing this order    
});
var user = mongoose.model("users", userSchema);



// Your first function handler
module.exports.hello = (event, context, cb) => {
    console.log("execution started here");
    mongoose.connect(dbURI);
    console.log("connect fired");
    cb(null, { message: 'inzi, Your First Serverless Lambda Function is Up and Running on AWS Microwave Service!' });
};

module.exports.signup = (event, context, cb) => {
    console.log("query value1: ", event.query.value1);
    console.log("body: ", event.body);
    var username = event.body.username;
    var password = event.body.password;

    var newUser = new user({
        username: username,
        password: password
    });
    newUser.save(function(err, data) {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("data: ", data);
        }

        cb(null,{
            message: 'function executed successfully - POST!',
            event
        });
    });

module.exports.login = (event, context, cb) => {
    
    console.log("body: ", event.body);
    var username = event.body.username;
    var password = event.body.password;

    newUser.findOne({username : username, password : password},function(err, data) {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("data: ", data);
        }

        cb(null,{
            message: 'function executed successfully - POST!',
            event
        });
    });
};

// You can add more handlers here, and reference them in serverless.yml
