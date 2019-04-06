module.exports = {
  globals: {
    __: true,
    cracked: true,
    NexusUI: true,
    Nexus: true
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    // Stylistic http://eslint.org/docs/rules/#stylistic-issues
    semi: [1, 'always'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1
      }
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'no-mixed-operators': [
      'error',
      {
        allowSamePrecedence: true
      }
    ],
    'brace-style': ['error', '1tbs'],
    'no-underscore-dangle': ['off'],
    'padded-blocks': ['error', 'never'],
    'spaced-comment': ['error', 'always'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignorePattern: '^test.|skip.|moduleForComponent.|moduleFor.|import.'
      }
    ],
    complexity: ['error', 4],

    // ECMAScript 6 http://eslint.org/docs/rules/#ecmascript-6
    'prefer-const': ['off'],
    'prefer-rest-params': ['off'],

    // Best Practices http://eslint.org/docs/rules/#best-practices
    'consistent-return': ['off'],

    // Ember recommended
    'ember/no-observers': ['error']
  },
  overrides: [
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
