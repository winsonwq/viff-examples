var wd = require('wd');

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var ViffClient = require('viff-client');

chaiAsPromised.transferPromiseness = wd.transferPromiseness;

describe('Github Page Test', function() {

  this.timeout(100000);

  var browser, buildScreenshot, prodScreenshot, buildClient, prodClient;

  before(function (done) {
    browser = wd.promiseChainRemote('http://localhost:4444/wd/hub');
    browser.init({ browserName: 'chrome' }).nodeify(done);

    buildClient = new ViffClient('http://localhost:3000', {
      name: 'build',
      host: 'http://localhost:8000/example/build/github.html',
      capabilities: 'chrome'
    });

    buildScreenshot = prepareTakeScreenshot(browser, buildClient);

    prodClient = new ViffClient('http://localhost:3000', {
      name: 'prod',
      host: 'http://localhost:8000/example/prod/github.html',
      capabilities: 'chrome'
    });

    prodScreenshot = prepareTakeScreenshot(browser, prodClient);
  });

  after(function (done) {
    buildClient.generateReport(function () {
      browser.quit().nodeify(done);
      // buildClient.end(function () {
      // });
    });
  });

  describe('in build environment', function() {

    beforeEach(function(done) {
      browser
        .get("http://localhost:8000/example/build/github.html")
        .waitForElementByCssSelector('.repo-list-item', browser.isDisplayed())
        .nodeify(done);
    });

    it('could go to Home Page', function(done) {
      buildScreenshot({ 'Home Page': ['/github.html'] }, 'screenshots/homepage.png', function () {
        browser.title().should.become("TJ Holowaychuk's Github Repositories").nodeify(done);
      });
    });

    it('should filter repo as per keyword', function(done) {
      browser
        .elementByCssSelector('[type="search"]').type('commander.js')
        .sleep(1000)
        .elementsByCssSelector('.repo-list-item')
        .then(function (elements) {
          elements.length.should.eql(1);
          buildScreenshot({ 'Search Result': ['/github.html'] }, 'screenshots/filter.png', done);
        });
    });

    it('should jump to github', function(done) {
      browser
        .elementByCssSelector('.repo-list-item:nth-child(2)')
        .click()
        .waitForElementByCssSelector('.pagehead', browser.isDisplayed())
        .title().should.become("visionmedia/co · GitHub")
        .then(function () {
          buildScreenshot({ 'Repository Detail on github': ['/github.html'] }, 'screenshots/github.png', done);
        });
    });
  });

  describe('in prod environment', function() {

    beforeEach(function(done) {
      browser
        .get("http://localhost:8000/example/prod/github.html")
        .waitForElementByCssSelector('.repo-list-item', browser.isDisplayed())
        .nodeify(done);
    });

    it('could go to Home Page', function(done) {
      prodScreenshot({ 'Home Page': ['/github.html'] }, 'screenshots/homepage.png', function () {
        browser.title().should.become("TJ Holowaychuk's Github Repositories").nodeify(done);
      });
    });

    it('should filter repo as per keyword', function(done) {
      browser.elementByCssSelector('[type="search"]').type('commander.js')
        .sleep(1000)
        .elementsByCssSelector('.repo-list-item')
        .then(function (elements) {
          elements.length.should.eql(1);
          prodScreenshot({ 'Search Result': ['/github.html'] }, 'screenshots/filter.png', done);

        });
    });

    it('should jump to github', function(done) {
      browser
        .elementByCssSelector('.repo-list-item:nth-child(2)')
        .click()
        .waitForElementByCssSelector('.pagehead', browser.isDisplayed())
        .title().should.become("visionmedia/co · GitHub")
        .then(function () {
          prodScreenshot({ 'Repository Detail on github': ['/github.html'] }, 'screenshots/github.png', done);
        });
    });
  });
});

function prepareTakeScreenshot(browser, viffClient) {
  return function (url, imagePath, callback) {
    browser
      .saveScreenshot(imagePath)
      .then(function () {
        viffClient.post(url, imagePath, callback);
      });
  };
}
