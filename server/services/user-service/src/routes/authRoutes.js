"use strict";

const router = require('express').Router();

const authController = require(`${__dirname}/../controllers/authController`);

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);


module.exports = router;