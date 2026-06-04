/**
 * Author: Ryan Stokes
 * File: rateLimiters.js
 */

import rateLimit from "express-rate-limit";

// Define a flag to check if the environment is test or integration, used to skip rate limiting during tests
const isTest =
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "integration";


// Generic rate limiter for general API routes, allowing 50 requests per 15 minutes per IP address
export const genericLimiter = rateLimit({

    // 15 minutes
    windowMs: 15 * 60 * 1000, 

    // limit each IP to 50 requests per window
    max: 50, 

    // Skip rate limiting in test environments to avoid interference with automated tests
    skip: () => isTest

});

// Specific rate limiter for authentication routes, allowing 30 requests per 15 minutes per IP address to prevent brute-force attacks on login and registration endpoints
export const authLimiter = rateLimit({

    // 15 minutes
    windowMs: 15 * 60 * 1000, 

    // limit each IP to 30 requests per window
    max: 30, 

    // Skip rate limiting in test environments to avoid interference with automated tests
    skip: () => isTest

});