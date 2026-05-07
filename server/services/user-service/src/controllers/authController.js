"use strict";

const { asyncErrorHandler, AppError } = require('lumina-utils');

const User = require(`${__dirname}/../models/userModel`);

exports.register = asyncErrorHandler(async (req, res, next) => {
    
    if (!req.body) {
        return next(new AppError("Invalid Request!", 400));
    }

    const user = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        message: 'Profile Created!',
        data: { user }
    });
});

