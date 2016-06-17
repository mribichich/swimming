// Karma configuration
// Generated on Mon Jul 13 2015 22:09:50 GMT-0300 (ART)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jspm'],


    // list of files / patterns to load in the browser
    files: [
      // { pattern: 'bower_components/angular/angular.js', included: false },
      // { pattern: 'bower_components/angular-animate/angular-animate.js', included: false },
      // { pattern: 'bower_components/angular-material/angular-material.js', included: false },
      // { pattern: 'bower_components/angular-messages/angular-messages.js', included: false },
      // { pattern: 'bower_components/angular-aria/angular-aria.js', included: false },
      // { pattern: 'bower_components/angular-mocks/angular-mocks.js', included: false },
      // { pattern: 'bower_components/angular-sanitize/angular-sanitize.js', included: false },
      // { pattern: 'node_modules/angular-new-router/dist/router.es5.js', included: false },
      // { pattern: 'node_modules/node-uuid/uuid.js', included: false },
      // { pattern: 'bower_components/angular-indexed-db/angular-indexed-db.js', included: false },
      // { pattern: 'bower_components/angular-i18n/angular-locale_es-ar.js', included: false },
      // { pattern: 'bower_components/underscore/underscore.js', included: false },
      // { pattern: 'bower_components/uri.js/src/URI.js', included: false },
      // { pattern: 'bower_components/uri.js/src/IPv6.js', included: false },
      // { pattern: 'bower_components/uri.js/src/punycode.js', included: false },
      // { pattern: 'bower_components/uri.js/src/SecondLevelDomains.js', included: false },

      // { pattern: 'tests/**/*Spec.js', included: false },

      // { pattern: 'tests/**/*.js.map', included: true },

      // { pattern: 'app/**/*.js', included: false }

      // { pattern: 'app/**/*.ts', included: true },
      // { pattern: 'app/**/*.js.map', included: true },

      'jspm_packages/system.src.js',
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    jspm: {
      // config: 'config.js',
      loadFiles: [
        'bin/tests/**/*Spec.js'
      ],
      serveFiles: [
        'bin/app/**/*.js'
      ]
    },

 // proxies: {
  //           '/base': '/base/app'
  //       },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
