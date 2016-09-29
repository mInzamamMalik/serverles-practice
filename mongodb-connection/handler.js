//'use strict';

var mongoose = require("mongoose");
var encryption = require("./pureFunctions/encryption");
var models = require("./db/models");
var auth = require("./pureFunctions/auth");

var dbURI = "mongodb://testuser:testuser@ds041536.mlab.com:41536/inztest";
//var dbURI = 'mongodb://localhost/mydatabase';

mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

/////////////////////////////////////////////////////////////////////////////////////
module.exports.signup = (event, context, cb) => {

    console.log("query: ", event.query);
    console.log("body: ", event.body);

    var username = event.body.username;
    var password = event.body.password;

    encryption.stringToHash(password).then(function (passwordHash) {

        console.log("abc");
        var newUser = new models.user({
            username: username,
            password: passwordHash
        });
        newUser.save(function (err, data) {
            if (err) {
                console.log("error: ", err);
            } else {
                console.log("data: ", data);
            }
            cb(null, {
                message: 'Signup Success!',
                event
            });
        });
    }, function (error) {
        cb("bcrypt error", { message: 'Signup Success!', error });
    });
}

/////////////////////////////////////////////////////////////////////////////////////
module.exports.login = (event, context, cb) => {

    console.log("body: ", event.body);
    var username = event.body.username;
    var password = event.body.password;

    // newUser.findOne({ username: username, password: password }, function (err, data) {
    //     if (err) {
    //         console.log("error: ", err);
    //     } else {
    //         console.log("data: ", data);
    //     }
    //     cb(null, {
    //         message: 'function executed successfully - POST!',
    //         event
    //     });
    // });
};

/////////////////////////////////////////////////////////////////////////////////////////