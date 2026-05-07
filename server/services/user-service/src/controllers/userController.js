"use strict";

const { asyncErrorHandler, AppError } = require('lumina-utils');

const User = require(`${__dirname}/../models/userModel`);

const filterRequiredFields = (reqObj, allowedFields) => {
    const newObj = {};

    Object.keys(reqObj).forEach(field => {
        if (allowedFields.includes(field)) {
            newObj[field] = reqObj[field];
        }
    });

    return newObj;

}

// GET PROFILE (USER)
exports.getProfile = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// UPDATE PROFILE (USER)
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
    //Allowed-> firstname, lastname, email, photo, gender
    const allowedFields = ["firstname", "lastname", "email", "photo", "gender"];

    const filteredReqBody = filterRequiredFields(req.body, allowedFields);

    // Update user info
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredReqBody, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        message: 'Profile Updated!',
        data: { user: updatedUser }
    })

});

// Delete Profile (USER)
exports.deleteProfile = asyncErrorHandler(async (req, res, next) => {
    //await User.findByIdAndDelete(req.user._id);


    // Sot delete
    await User.findByIdAndUpdate({ active: false });

    res.status(204).json({
        status: 'sucess',
        data: null
    });
});
