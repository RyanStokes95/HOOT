/**
 * Author: Ryan Stokes
 * File: roleCheck.js
 * Last Modified: 2026-05-05
 */

// This middleware is used to check if the user has the required role to access a route.

//It is used in the routes to protect routes that require a specific role, such as teacher or parent.

export function requireRole(role) {
  return (req, res, next) => {

    if (!req.session || !req.session.userId) {
      return res.redirect("/login");
    }

    if (req.session.role !== role) {
      return res.status(403).send("Forbidden");
    }

    next();
  };
}