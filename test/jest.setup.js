import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../src/test_db.js";

// Jest is a testing framework that provides functions like beforeAll and afterAll

// It also provides describe,it and expect functions used in test files

// Clear the database before each test to ensure test
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
  await disconnectDB();
});

