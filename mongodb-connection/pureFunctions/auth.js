
var mongoose    = require("mongoose");
var q           = require("q");
var models      = require("../db/models");
var encryption  = require("./encryption");

exports.generateToken = function (someData) { //someData must be JSON
    var deferred = q.defer();

    encryption.stringToHash(JSON.stringify(someData)).then(function (Hash) {

        var newUser = new models.loggedInUsers({
            username: someData.username,
            hash: Hash
        });
        newUser.save(function (err, data) {
            if (err) {
                console.log("mongoose error: ", err);
                deferred.reject({ message: "mongoose error", err: err });
            } else {
                console.log("token: ", Hash);
                deferred.resolve(Hash);
            }
        });
    }, function (error) {
        console.log("bcrypt error: ", error);
        deferred.reject({ message: "bcrypt error", err: error });
    });
    return deferred.promise;
}


exports.verifyToken = function (tokenString) { //someData must be JSON
    var deferred = q.defer();

    encryption.validateHash(tokenString).then(function (isValid) {
        if (isValid) {
            console.log("token is valid, checking login status for this token...");
            models.loggedInUsers.findOne({ hash: tokenString }, function (err, data) {
                if (err) {

                    console.log("some error occured in findOne in logged in users: ", err);
                    deferred.reject("some error occured in findOne in logged in users: ");

                } else {
                    console.log("token verified ");
                    deferred.resolve("token verified ");
                }
            })
        } else {
            console.log("token is not valid");
            deferred.reject("token is not valid");
        }
    });

    return deferred.promise;
}