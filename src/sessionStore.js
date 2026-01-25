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

  store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI_CI || process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 60 * 15,
  });

  return store;
}

export function getSessionStore() {
  return store;
}