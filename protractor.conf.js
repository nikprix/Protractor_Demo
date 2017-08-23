var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
var path = require('path');

exports.config = {

    // The LOCAL location of the selenium standalone server .jar file.
    // IMPORTANT - for now, it always has to match newest downloaded version from node modules
    // SO, path has to be manually updated with version. TODO - write shell script that will point to the last version.
    seleniumServerJar: 'node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.5.2.jar',

    // The port to start the selenium server on, or null if the server should find its own unused port.
    seleniumPort: null,

    // Chromedriver LOCAL location is used to help the selenium standalone server find chromedriver.
    //chromeDriver: 'node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver',

    // Additional command line options to pass to selenium. For example,
    // if you need to change the browser timeout, use
    // seleniumArgs: ['-browserTimeout=60'],
    seleniumArgs: [],

    // If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
    // The tests will be run remotely using SauceLabs.
    sauceUser: null,
    sauceKey: null,

    // ----- Tests to run -----
    //specs: [
    //    './tests/TodoMVC/*.js'
    //],

    // ----- Capabilities to be passed to the webdriver instance ----
    //capabilities: {
    //    'browserName': 'chrome'
    //},

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    // baseUrl: 'http://localhost:9999',

    // Selector for the element housing the angular app - this defaults to
    // body, but is necessary if ng-app is on a descendant of <body>
    //rootElement: 'body',

    //
    beforeLaunch: function () {
        console.log('================================ LAUNCHING TESTS ====================================');
    },

    // Reporting
    onPrepare: function () {

        // global reference to 'browser.driver'
        global.dvr = browser.driver;

        // set implicit wait times in ms...
        browser.manage().timeouts().implicitlyWait(5000);

        // maximaze browsers page - DOES NOT WORK in CHROME on MAC, using '--start-maximized' in Grunt's config
        browser.driver.manage().window().maximize();

        // set browser size...
        //browser.manage().window().setSize(1024, 800);

        // Since mDADI is not Angular app, we need to disable Protractor's check if page contains Angular
        global.isAngularSite = function (flag) {
            browser.ignoreSynchronization = !flag;
        };

        // Add a reporter and store screenshots to `screnshots`:
        // Settings - https://www.npmjs.com/package/protractor-jasmine2-html-reporter
        jasmine.getEnv().addReporter(
            new Jasmine2HtmlReporter({
                savePath: 'tmp/reports',
                screenshotsFolder: 'images'
            })
        );
    },

    // ----- Options to be passed to minijasminenode -----
    jasmineNodeOpts: {
        // onComplete will be called just before the driver quits.
        onComplete: null,
        // If true, display spec names.
        isVerbose: false,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 50000
    }
};
