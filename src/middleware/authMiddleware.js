/**
 * Author: Ryan Stokes
 * File: authMiddleware.js
 * Last Modified: 2026-05-05
 */

/** 
 * Auth middleware is needed to protect routes that require authentication. 
 * It checks if the user has a valid session and if they are authenticated before 
 * allowing access to the route. If the user is not authenticated, it responds with a 
 * 401 Unauthorized status code or redirects to the login page. 
 */

//requireAuth failure will respond with 401 Unauthorized, requireAuthPage failure will redirect to login page

/**
 * This middleware is used for protecting API routes that require authentication.
 * If the user is not authenticated, it responds with a 401 Unauthorized status code.
 */
export function requireAuth(req, res, next) {
    // Checks if the user has a valid session or if the user is authenticated
    // If threre is no session or no userId in session, respond with 401 Unauthorized
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // If authenticated, proceed to the next middleware/controller, without next() the function will hang
    next();
}


/** 
 * This middleware is used for protecting pages that require authentication.
 * If the user is not authenticated, it redirects them to the login page instead of responding with a 401 status code.
 */
export function requireAuthPage(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login");
  }
  // If authenticated, proceed to the next middleware/controller, without next() the function will hang
  next();
}