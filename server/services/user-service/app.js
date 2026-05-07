const express = require('express'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    cors = require('cors'),
    {errorHandler} = require('lumina-utils');

// Load Environment Variables

dotenv.config({ path: `${__dirname}/config.env`, quiet: false, debug: true });

// Create Express App
const app = express();

// Middlewares to parse JSON
app.use(express.json());
app.use(cors())

// Routes
const userRouter = require(`${__dirname}/src/routes/userRoutes`);
const authRouter = require(`${__dirname}/src/routes/authRoutes`);


app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

// Global Error Handler
app.use(errorHandler);


module.exports = app;