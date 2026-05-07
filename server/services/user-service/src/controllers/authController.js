"use strict";
const jwt = require('jsonwebtoken');

const { asyncErrorHandler, AppError } = require('lumina-utils');

const User = require(`${__dirname}/../models/userModel`);

const createToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}


// REGISTER
exports.register = asyncErrorHandler(async (req, res, next) => {

    if (!req.body) {
        return next(new AppError("Invalid Request!", 400));
    }

    const user = await User.create(req.body);

    // Generate Token
    const token = createToken(user._id);

    // Add To Cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN)
    });


    res.status(201).json({
        status: 'success',
        message: 'Profile Created!',
        token,
        data: { user }
    });
});

// LOGIN
exports.login = asyncErrorHandler(async (req, res, next) => {
    // req.body => email, password
    if (!req.body) {
        return next(new AppError("Invalid Request!", 400));
    }

    if (!req.body.email && !req.body.password) {
        return next(new AppError("Email and Password are required.", 400));
    }

    // Check if user exists
    const user = await User.findOne({ email: req.body.email }).select('+password');

    if (!user) {
        return next(new AppError("User does not exist.", 404));
    }

    if (!user.active) {
        return next(new AppError("Account is inactive. Contact the administrator to activate.", 404));
    }

    // Verify User password
    const isValidPassword = await user.correctPassword(req.body.password, user.password);

    if (!isValidPassword) {
        return next(new AppError("Incorrect Password.", 400));
    }

    // Create Token

    const token = createToken(user._id);

    // Add To Cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 // 24 hours
    });

    res.status(200).json({
        status: 'success',
        message: "Login Sucessful",
        token,
        data: { user }
    });

});

