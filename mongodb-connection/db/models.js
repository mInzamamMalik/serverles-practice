var mongoose = require("mongoose");

var schemas = require("./schema");


exports.user            = mongoose.model("users", schemas.userSchema);
exports.loggedInUsers   = mongoose.model("loggedInUsers", schemas.loggedInUsers);
