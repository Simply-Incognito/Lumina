"use strict";

const router = require('express').Router();

const userController = require(`${__dirname}/../controllers/userController`);

const authMiddleware = require(`${__dirname}/../middlewares/authmiddleware`);

router.route('/profile')
    .get(authMiddleware.protect, userController.getProfile)
    .patch(authMiddleware.protect, userController.updateProfile)
    .delete(authMiddleware.protect, userController.deleteProfile);

module.exports = router;