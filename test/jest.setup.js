import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../src/test_db.js";

//Connect to test DB before all tests run
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
});

beforeEach(async () => {
  // Clean DB between tests for determinism
  await mongoose.connection.db.dropDatabase();
});

afterEach(async () => {
  // Clean DB between tests for determinism
  await mongoose.connection.db.dropDatabase();
});

// Disconnect DB after all tests are done to prevent hanging Jest process and CI timeouts
afterAll(async () => {
  await disconnectDB();
});

