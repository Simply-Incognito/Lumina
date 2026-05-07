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
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Please provide your gender!'],
        trim: true
    },
    photo: String,

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



// Hash Password
userSchema.pre('save', async function () {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return;

    // Hash the password with cost of 10
    this.password = await bcrypt.hash(this.password, 10);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
});

// Update passwordChangedAt property for relevant users
userSchema.pre('save', function () {
    if (!this.isModified('password') || this.isNew) return;

    this.passwordChangedAt = Date.now() - 1000;
});

// Instance Method: Check if password is correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance Method: Check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    //False means NOT changed
    return false;
};


// Create Model
const User = model('User', userSchema);

module.exports = User;