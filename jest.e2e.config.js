const jestdefaultconfig = require('./jest.config');

module.exports = {
  ...jestdefaultconfig,
  testMatch: ['**/*.test.ts'],
};
