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

    models.user.findOne({ username: username }, function (err, data) {
        if (!err) {
            if (!data) {
                console.log("user not exist: ", err);
                cb(null, {
                    message: 'usernot exist!',
                    event
                });
            } else {
                console.log("user found in database, checking password", data);
                encryption.varifyHash(password, data.password).then(function (success) {
                    if (success) {
                        console.log("password is correct, generating token...");
                        //generate token here and send to user
                        auth.generateToken({ username: data.username }).then(function (token) {
                            console.log("logged in successfully, token: ", token);
                            cb(null, {
                                message: 'logged in successfully, token: ' + token,
                                event
                            });
                        }, function (err) {
                            console.log("error in token generation: ", err);
                            cb(null, {
                                message: 'error in token generation',
                                event
                            });
                        });
                    } else {
                        console.log("password is incorrect");
                        cb(null, {
                            message: "password is incorrect",
                            event
                        });
                    }
                }, function (err) {
                    console.log("password not matched", err);
                    cb(null, {
                        message: "password not matched",
                        event
                    });
                });
            }            
        }
    })
};

/////////////////////////////////////////////////////////////////////////////////////////
module.exports.profile = (event, context, cb) => {
    //verify token here

};
/////////////////////////////////////////////////////////////////////////////////////