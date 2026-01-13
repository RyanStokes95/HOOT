import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../src/test_db.js";

beforeAll(async () => {
  await connectDB(process.env.MONGODB_URI_CI);

  const dbName = mongoose.connection.name;
  if (!dbName.includes("hoot_ci")) {
    throw new Error(
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

afterAll(async () => {
  await disconnectDB();
});

