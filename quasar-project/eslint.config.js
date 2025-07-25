// Import ESLint configurations and plugins
import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import pluginQuasar from '@quasar/app-webpack/eslint';
import pluginCypress from 'eslint-plugin-cypress/flat';
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    // Ignore specific files (Quasar already ignores node_modules, etc.)
    // ignores: []
  },
  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,
  // Use essential Vue.js rules for error prevention
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly', // BEX related
      },
    },
    // Custom rules for the project
    rules: {
      'prefer-promise-reject-errors': 'off',
      // Allow debugger in development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },
  {
    // Configuration for PWA service worker
    files: ['src-pwa/custom-service-worker.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    // Configuration for Cypress test files
    files: ['test/cypress/**/*.js'],
    env: {
      'cypress/globals': true, // Enable Cypress globals (describe, it, cy, etc.)
    },
    extends: [
      'plugin:cypress/recommended', // Recommended Cypress rules
    ],
    plugins: {
      cypress: pluginCypress, // Add Cypress plugin
    },
  },
  prettierSkipFormatting,
];