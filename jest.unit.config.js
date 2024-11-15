const jestdefaultconfig = require('./jest.config');

module.exports = {
  ...jestdefaultconfig,
  testMatch: ['**/*.spec.ts'],
};
