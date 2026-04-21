/**
 * Author: Ryan Stokes
 * File: roleCheck.js
 * Last Modified: 2026-04-21
 */

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