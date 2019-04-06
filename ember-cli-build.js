/* eslint-env node */
'use strict';
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {

    'ember-cli-babel': {
      includePolyfill: true
    },

    fingerprint: {
      enabled: process.env.NODE_ENV !== 'development',
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'ico', 'wav'],
    },
    minifyCSS: { enabled: process.env.NODE_ENV !== 'development' },
    minifyJS: { enabled: process.env.NODE_ENV !== 'development' },
    autoprefixer: {
      // https://github.com/ai/browserslist#queries
      browsers: ['> 1% in US', 'last 3 versions', 'Safari >= 8']
    },

    ace: {
      themes: ['ambiance', 'chaos'],
      modes: ['javascript'],
      workers: ['javascript']
    }

  });

  app.import('vendor/i_dropped_my_phone_the_screen_cracked/dist/cracked.js');
  app.import('vendor/nexusui/dist/NexusUi.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
