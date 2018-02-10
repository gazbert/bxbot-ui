// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// gazbert:
// args: ['--disable-browser-side-navigation'] is needed because of:
// https://bugs.chromium.org/p/chromedriver/issues/detail?id=2239

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
      'browserName': 'chrome',
      'chromeOptions': {
          args: ['--disable-browser-side-navigation']
      }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
