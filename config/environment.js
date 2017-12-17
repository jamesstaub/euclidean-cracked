/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'euclidean-cracked',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    firebase: {
      apiKey: "AIzaSyAESGR-rqetWMWsOxCHjZHPvtgfs-UQ9L0",
      authDomain: "euclidean-cracked.firebaseapp.com",
      databaseURL: "https://euclidean-cracked.firebaseio.com",
      projectId: "euclidean-cracked",
      storageBucket: "",
      messagingSenderId: "13537402201"
    },
    torii: {
      sessionServiceName: 'session'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.audioDirectory = '/audio/TR-808-Kit-05/'
  ENV.audioFileNames = [
    'Bassdrum-01.wav',
    'Bassdrum-02.wav',
    'Bassdrum-03.wav',
    'Bassdrum-04.wav',
    'Bassdrum-05.wav',
    'Cabasa.wav',
    'Clap.wav',
    'Claves.wav',
    'Cowbell.wav',
    'Crash-01.wav',
    'Crash-02.wav',
    'Hat Closed.wav',
    'Hat Open.wav',
    'Tom H.wav',
    'Tom L.wav',
    'Tom M.wav',
    'Rimshot.wav',
    'Snaredrum.wav'
  ];

  return ENV;
};
