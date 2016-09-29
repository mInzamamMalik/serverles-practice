
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
                deferred.reject({message: "mongoose error", err: err});
            } else {
                console.log("token: ",Hash);
                deferred.resolve(Hash);
            }            
        });
    }, function (error) {
        console.log("bcrypt error: ", error);
        deferred.reject({message: "bcrypt error", err: error});
    });

    return deferred.promise;
}