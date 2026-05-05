"use strict";

module.exports = class CustomError extends Error {
    constructor(errorMessage, statusCode) {
        super(errorMessage);

        this.statusCode = statusCode;
        this.status = (this.statusCode >= 400 && this.statusCode < 500) ? "fail" : "Server Error";
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor);

    }
}