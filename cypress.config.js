const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1700,
  viewportHeight: 850,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
