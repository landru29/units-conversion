module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/units-conversion.js',
            'src/**/*.js',
            'test/services/**/*.js'
        ],
        exclude: [
        ],
        preprocessors: {},
        reporters: ['dots'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
