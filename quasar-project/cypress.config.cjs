// Import required modules
const { defineConfig } = require("cypress");
const fs = require("fs");
const { injectQuasarDevServerConfig } = require("@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server");

module.exports = defineConfig({
  e2e: {
    // Dynamic base URL for the Quasar frontend
    baseUrl: process.env.CYPRESS_FRONTEND_URL || "http://localhost:9000",
    // Environment variables for API
    env: {
      apiUrl: process.env.CYPRESS_API_URL || "http://localhost:8000",
    },
    // Configure node events for custom tasks and browser settings
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.name === "electron") {
          // Disable fullscreen to avoid display issues
          launchOptions.preferences.fullscreen = false;
        }
        return launchOptions;
      });

      on("task", {
        // Log messages to console
        log(message) {
          console.log(message);
          return null;
        },
        // Read file content if it exists
        readFileMaybe({ path }) {
          if (fs.existsSync(path)) {
            return fs.readFileSync(path, "utf8");
          }
          return null;
        },
      });

      return config;
    },
    // Path to E2E support file (adjusted for Quasar structure)
    supportFile: "test/cypress/support/e2e.js",
    // Pattern for E2E test files
    specPattern: "test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    // Folder for downloaded files
    downloadsFolder: "test/cypress/downloads",
    // Disable screenshots and videos for debugging (as per your config)
    screenshotOnRunFailure: false,
    video: false,
    // Timeout settings for CI
    defaultCommandTimeout: 10000, // 10 seconds
    requestTimeout: 15000, // 15 seconds
  },
  component: {
    // Configure dev server for Quasar component testing
    devServer: injectQuasarDevServerConfig(),
    // Path to component testing support file
    supportFile: "test/cypress/support/component.js",
    // Pattern for component test files
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    // Component testing index file
    indexHtmlFile: "test/cypress/support/component-index.html",
  },
  // Project ID for Cypress Cloud (if used)
  projectId: "8v18h7",
});