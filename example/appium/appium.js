var fs = require('fs');
var wd = require('wd');
var _ = require('underscore');
var Q = require('q');
require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
require("mocha-as-promised")();

chai.use(chaiAsPromised);
var should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

describe('appium test', function() {
  var driver;

  before(function () {
    this.timeout(300000);
    driver = wd.promiseChainRemote({
      host: 'localhost',
      port: 4723
    });

    return driver.init({
      browserName: '',
      'appium-version': '1.3',
      platformName: 'iOS',
      platformVersion: '8.1',
      deviceName: 'iPhone Simulator',
      app: 'http://appium.github.io/appium/assets/WebViewApp7.1.app.zip'
    });
  });

  after(function () {
    return driver.quit();
  });

  it("should get the url", function () {
    return driver
      .elementByXPath('//UIATextField[@value=\'Enter URL\']')
        .sendKeys('www.google.com')
      .elementByName('Go').click()
      .elementByClassName('UIAWebView').click() // dismissing keyboard
      .context('WEBVIEW')
      .sleep(1000)
      .waitForElementByName('q', 5000)
        .sendKeys('sauce labs')
        .sendKeys(wd.SPECIAL_KEYS.Return)
      .sleep(1000)
      .title().should.eventually.include('sauce labs');
  });

  it('take screenshot', function() {
    return driver.takeScreenshot().then(function(img) {
      fs.writeFileSync('output.png', new Buffer(img, 'base64'));
      return img;
    });
  })

});
