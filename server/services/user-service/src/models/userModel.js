"use strict";

const { Schema, model } = require('mongoose'),
    validator = require('validator'),
    bcrypt = require('bcryptjs');


// Deine User Schema
const userSchema = Schema({
    firstname: {
        type: String,
        required: [true, 'Please provide your firstname!'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Please provide your lastname!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false // This hides the password from API responses by default
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangedAt: Date
});

const User = model('User', userSchema);

module.exports = User;