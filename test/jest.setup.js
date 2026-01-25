import "dotenv/config";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../src/test_db.js";
import { getSessionStore } from "../src/sessionStore.js";

// Load different .env files based on NODE_ENV
const envfile = process.env.NODE_ENV === "integration" ? ".env.integration" : ".env.test";

dotenv.config({ path: envfile });


// Jest is a testing framework that provides functions like beforeAll and afterAll

// It also provides describe,it and expect functions used in test files

// Clear the database before each test to ensure test

// Code taken from https://jestjs.io/docs/ecmascript-modules utilised in Jest testing setup

async function clearDB() {
  const collections = await mongoose.connection.db.collections();
  for (const x of collections) {
    await x.deleteMany({});
  }
};

// Connect to test DB before all tests run
beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI_CI);
  // Ensure we are connected to the CI test database
  const dbName = mongoose.connection.name;
  if (!dbName.includes("hoot_ci")) {
    throw new Error(
        //dbname variable shows current database name if not connected to the expected test DB
      `Refusing to run tests on non-CI database: "${dbName}". Expected "hoot_ci".`
    );
  }
  await clearDB();
});

// Disconnect DB after all tests are done to prevent hanging Jest process and CI timeouts
afterAll(async () => {
  const store = getSessionStore();

  // Added to close the session store connection to prevent hanging Jest process
  // Checks for close method on store or its client and calls it
  if (store.close) {
    await store.close();
  } else if (store.client.close) {
    await store.client.close();
  }

  await disconnectDB();
});

