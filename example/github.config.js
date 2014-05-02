'use strict'

var config = module.exports = {
  seleniumHost: 'http://localhost:4444/wd/hub',
  browsers: ['chrome'],
  envHosts: {
    build: 'http://localhost:8000/example/build',
    prod: 'http://localhost:8000/example/prod'
  },
  paths: [],
  reportFormat: 'file',
  test: function test (description, caseConfig) {
    var c = {};
    c[description] = caseConfig;
    this.paths.push(c);
  }
};

config.test('Home Page', ['/github.html', function (browser) {
  return browser.waitForElementByCssSelector('.repo-list-item', browser.isDisplayed());
}]);

config.test('Search Result', ['/github.html', function (browser) {
  return browser
    .waitForElementByCssSelector('.repo-list-item', browser.isDisplayed())
    .elementByCssSelector('[type="search"]').type('commander.js')
    .sleep(1000);
}]);

config.test('Repository Detail on github', ['/github.html', function (browser) {
  return browser
    .waitForElementByCssSelector('.repo-list-item', browser.isDisplayed())
    .elementByCssSelector('.repo-list-item:nth-child(2)').click()
    .waitForElementByCssSelector('.pagehead', browser.isDisplayed());
}])
