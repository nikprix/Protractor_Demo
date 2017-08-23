module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-shell-spawn'); -- switching to grunt-shell
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('install',
        [
            'shell:npm_install',
            'shell:protractor_clean',
            'shell:protractor_install',
            'shell:chrome_driver_install',
            'shell:reporter_fix'
        ]
    );
    grunt.registerTask('default', ['jshint', 'protractor:demoRun', 'shell:open_report']); // add 'watch' task for
    // validation

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'Gruntfile.js',
                'tests/**/**/*.js'
            ]
        },
        watch: {
            files: [
                'Gruntfile.js',
                'tests/**/**/*.js'
            ],
            tasks: ['jshint']
        },
        protractor: {
            options: {
                configFile: "protractor.conf.js",
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false // If true, protractor will not use colors in its output.
            },
            demoRun: {
                options: {
                    args: {
                        baseUrl: "http://todomvc.com/", // setting up base URL here
                        specs: [
                            './tests/TodoMVC/specs/*.js'
                        ],
                        capabilities: {
                            'browserName': 'chrome'
                            //'browserName': 'firefox',
                            //'chromeOptions': {
                            //    'args': [
                            //        '--start-fullscreen'
                            //    ]
                            //    //'mobileEmulation': {
                            //    //    'deviceName': 'Apple iPhone 6'
                            //    //}
                            //}
                        }
                    }
                }
            }
        },
        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            protractor_clean: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager clean'
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager update'
            },
            chrome_driver_install: {
                command: 'source shell/chrome-driver-extract.sh'
            },
            reporter_fix: {
                command: 'source shell/reporter-fix.sh'
            },
            npm_install: {
                command: 'npm install'
            },
            open_report:{
                command: 'source shell/open-report.sh'
            }
        }

    });

};
