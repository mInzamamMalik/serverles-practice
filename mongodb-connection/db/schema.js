var mongoose = require("mongoose");
var Schema = mongoose.Schema;

exports.userSchema = new Schema({
    
        firstName: {
            type: String
        },

        lastName: {
            type: String
        },

        avatar: {
            type: String
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ['user', 'stylist', 'admin', 'super'],
            default: 'user',
            required: true
        },

        fbId: {
            type: String,
            unique: 1
        },

        timeZone: {
            type: Number,
            default: -7
        },

        payment: {
            stripeId: String,
            status: {
                type: String,
                enum: ['unverified', 'verified', 'pending']
            }
        },

        pushTokens: [{
            type: String
        }],

        resetToken: {
            type: String
        },

        active: {
            type: Boolean,
            required: true,
            default: true
        }  
});

exports.loggedInUsers = new Schema({
    hash: String,
    email: String,        
});