module.exports = {
  default: {
    require: ['ts-node/register', 'test/features/**/*.steps.ts'],
    format: ['@cucumber/pretty-formatter'],
    paths: ['test/features/**/*.feature'],
  },
};
