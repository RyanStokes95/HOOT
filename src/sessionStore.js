/**
 * Author: Ryan Stokes
 * File: sessionStore.js
 * Last Modified: 2026-01-25
 */

import MongoStore from "connect-mongo";

// Session store singleton instance
// Is a singleton to avoid multiple connections to MongoDB for session storage
let store;

export function buildSessionStore() {
  if (store) return store;

  // Needs to be set as a variable for Heroku deployment, otherwise tries to read MONGODB_URI_CI even when not in CI environment
  const mongoUrl = process.env.MONGODB_URI_CI || process.env.MONGODB_URI;

  if (!mongoUrl) {
    throw new Error("Missing MongoDB URI: set MONGODB_URI or MONGODB_URI_CI");
  }

  store = MongoStore.create({
    mongoUrl,
    collectionName: "sessions",
    ttl: 60 * 15,
  });

  return store;
}

export function getSessionStore() {
  return store;
}