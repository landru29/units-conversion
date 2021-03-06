module.exports = function (grunt) {
    'use strict';

    var path = require('path');

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var returnIndex = function (connect) {
        return connect.static('index.html');
    };

    var project= {
        dist: './dist',
        src: './src'
    };

    var pkg = (require('./package.json'));


    // Configure Grunt
    grunt.initConfig({

        pkg: pkg,
        project: project,


        jshint: {
            dev: [
                '<%= project.src%>/**/*.js',
                'Gruntfile.js'
            ]
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        clean: {
            dist: ['<%= project.dist%>']
        },

        concat: {
            dist: {
                files: {
                    '<%= project.dist%>/units-conversion.js': ['<%= project.src%>/units-conversion.js', '<%= project.src%>/**/*.js']
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    '<%= project.dist%>/units-conversion.min.js': ['<%= project.dist%>/units-conversion.js']
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['<%= project.dist%>/units-conversion.js']
                    }
                ]
            }
        },

        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                startPage: '/api',
                title: "UnitsConversion Documentation",
                titleLink: "/api",
                sourceLink: 'https://github.com/landru29/units-conversion/blob/master/{{file}}#L{{codeline}}'
            },
            api: {
                title: 'Library',
                src: ['src/**/*.js']
            }
        }

    });


    grunt.registerTask('dist', [
        'jshint:dev',
        'clean:dist',
        'test',
        'ngdocs',
        'concat:dist',
        'ngAnnotate:dist',
        'uglify:dist'
    ]);

    grunt.registerTask('default', ['dist']);

    grunt.registerTask('test', ['karma']);
};
