const express = require('express'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    cors = require('cors');

// Load Environment Variables

dotenv.config({ path: `${__dirname}/config.env`, quiet: false, debug: true });

// Create Express App
const app = express();

app.get('/health', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        msessage: 'User Service is healthy'
    });
})


module.exports = app;