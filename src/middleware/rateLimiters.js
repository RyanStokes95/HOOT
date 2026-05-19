/**
 * Author: Ryan Stokes
 * File: rateLimiters.js
 * Last Modified: 2026-05-20
 */

import rateLimit from "express-rate-limit";

export const genericLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per window
});