"use strict";

const mongoose = require('mongoose'),
dotenv = require('dotenv');

const app = require(`${__dirname}/app`);

dotenv.config({ path: `${__dirname}/config.env`, quiet: false, debug: true });

// Connect DB
mongoose.connect(process.env.USER_SERVICE_MONGO_URI)
    .then(() => console.log('✅ User DB Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err));


const PORT = process.env.PORT || 3001;

// Server
const server = app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
});