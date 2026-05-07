"use strict";
const { asyncErrorHandler, AppError } = require('lumina-utils');

const jwt = require('jsonwebtoken');


// 1. Add User import
const User = require('../models/userModel');

// Protect Routes
exports.protect = asyncErrorHandler(async (req, res, next) => {
    // Check if token exists
    var token;

    if (req.headers.authorization && req.headers.authorization.toLowerCase().startsWith("bearer")) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new AppError("You are not logged in!", 401));
    }

    // Verify Token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch User
    const user = await User.findById(decodedToken.id);

    if (!user) {
        return next(new AppError("User does not exist!", 404));
    }

    // Check if User Changed Password After Token Was Issued

    const isPasswordModified = user.changedPasswordAfter(decodedToken.iat);

    if (isPasswordModified) {
        return next(new AppError("Password changed recently. Please login again.", 400));
    }

    //Check if user is inactive

    if (!user.active) {
        return next(new AppError("Your account is disabled! Please contact the administrator.", 403));
    }

    // Allow user to access the route
    req.user = user;
    next(); // Call next middleware

});

// Restrict - RBAC -> roles(admin, user)
exports.restrictTo = (...roles) => asyncErrorHandler(async (req, res, next) => {
    const role = req.user.role;

    if (!roles.includes(role)) {
        return next(new AppError("You are not allowed to perform this action!", 403));
    }

    next();
});