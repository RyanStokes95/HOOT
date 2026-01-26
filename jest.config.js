/**
 * Author: Ryan Stokes
 * File: jest.config.js
 * Last Modified: 2026-01-25
 */

//Code taken and inspired by https://www.youtube.com/watch?v=FKnzS_icp20&list=PLlxGQpt_kNBcVSpnseYS7_zTO-NmxHLKl

// This is a basic Jest configuration file for a Node.js environment, tells jest this app is Node.js
export default {
  testEnvironment: "node",
  // Ensures tests run sequentially to avoid DB conflicts
  maxWorkers: 1 
};
