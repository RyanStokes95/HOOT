import js from "@eslint/js";
import globals from "globals";

/*
  ESLint configuration file for the HOOT project, extending the recommended JavaScript 
  rules and defining global variables for Node.js, browser, and Jest environments. 
*/

// Exporting the ESLint configuration as an array of configurations, allowing for overrides based on file patterns
export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // Override for test files, adding Jest globals to the environment
  {
    files: ["test/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];