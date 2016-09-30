
var bcrypt = require("bcrypt-nodejs");
var q = require("q");

//this function will take a string as input and return hash on success and error object on error

exports.stringToHash = function (PasswordString) {

    var deferred = q.defer();
    var round = 10;
    bcrypt.genSalt(round, function (err, salt) {
        if (err) {
            deferred.reject(err);
        }
        bcrypt.hash(PasswordString, salt, function () { }, function (err, hashedPassword) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(hashedPassword);
        });
    });
    return deferred.promise;
}

exports.varifyHash = function (realPassword, hashString) {
    var deferred = q.defer();
    bcrypt.compare(realPassword, hashString, function (err, result) {//'result'' will be boolean 
        if (err) {
            deferred.reject(err);//it means hash is invalid
        }
        deferred.resolve(result);//return with boolean 'Hash' is matched or not
    });
    return deferred.promise;
}


exports.validateHash = function (hashString) {//true or false in resolve, no reject
    var deferred = q.defer();
    bcrypt.compare("dummy", hashString, function (err, result) {//'result'' will be boolean 
        if (err) {
            deferred.resolve(false);//it means Hash is invalid
        }
        deferred.resolve(true);//it means hash is either matched or not but it is a valid Hash
    });
    return deferred.promise;
}