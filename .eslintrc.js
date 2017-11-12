module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
  },
  globals: {
    "__": true,
    "cracked":true,
    "NexusUI": true,
    "Nexus": true,
}
};
