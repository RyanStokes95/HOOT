// This is a basic Jest configuration file for a Node.js environment, tells jest this app is Node.js
export default {
  testEnvironment: "node",
  // Ensures tests run sequentially to avoid DB conflicts
  maxWorkers: 1 
};
