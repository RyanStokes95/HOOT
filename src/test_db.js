/**
 * Author: Ryan Stokes
 * File: test_db.js
 * Last Modified: 2026-01-25
 */

import mongoose from "mongoose";

//Test db connection using MONGODB_URI_CI variable

// Connect and Disconnect functions needed for testing and CI

// Exports DB Connection if URI is preent and found and not already connected

// readyState of 1 = connected  0 = disconnected

export async function connectDB(uri = process.env.MONGODB_URI_CI) {
  if (!uri) throw new Error("MONGODB_URI_CI is not set");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
}

// Disconnects from the database if connected

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
