/**

 * Author: Ryan Stokes

 * File: rateLimiters.js

 * Last Modified: 2026-05-20

 */

import rateLimit from "express-rate-limit";

// Define a flag to check if the environment is test or integration, used to skip rate limiting during tests
const isTest =
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "integration";


export const genericLimiter = rateLimit({

    // 15 minutes
    windowMs: 15 * 60 * 1000, 

    // limit each IP to 100 requests per window
    max: 100, 

    // Skip rate limiting in test environments to avoid interference with automated tests
    skip: () => isTest

});


export const authLimiter = rateLimit({

    // 15 minutes
    windowMs: 15 * 60 * 1000, 

    // limit each IP to 10 requests per window
    max: 10, 

    // Skip rate limiting in test environments to avoid interference with automated tests
    skip: () => isTest

});