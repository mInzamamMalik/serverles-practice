
var bcrypt = require("bcrypt-nodejs");
var q = require("q");

//this function will take a string as input and return hash on success and error object on error

exports.stringToHash = function(PasswordString) {

    var deferred = q.defer();
    var round = 10;
    bcrypt.genSalt(round, function(err, salt) {
        if (err) {
            deferred.reject(err);
        }
        bcrypt.hash(PasswordString, salt, function() { }, function(err, hashedPassword) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(hashedPassword);
        });
    });
    return deferred.promise;
}