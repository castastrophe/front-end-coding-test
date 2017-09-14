"use strict";

module.exports = function ( grunt ) {
    require( "load-grunt-tasks" )( grunt );
    
    var paths = {
        src: "./src",
        dist: "./dist",
        tmp: "./tmp",
    };

    grunt.initConfig( {
        pkg: grunt.file.readJSON( "package.json" ),
        // https://www.npmjs.com/package/grunt-contrib-clean
        clean: {
            assets: [ paths.dist + "/*" ],
            tmp: [ paths.tmp ],
            sassGlobbing: [ paths.src + "/**/__*" ]
        },
        copy: {
            images: {
                expand: true,
                cwd: paths.src + "/",
                src: [ "**/*.{png,jpg,gif}" ],
                dest: paths.dist + "/"
            }
        },
        // https://github.com/sindresorhus/grunt-sass
        sass: {
            options: {
                includePaths: [ paths.src + "/sass" ],
                sourceMap: true,
                outputStyle: "expanded"
            },
            global: {
                files: [ {
                    expand: true,
                    cwd: paths.src + "/sass",
                    src: [ "default.scss" ],
                    dest: paths.dist + "/css/",
                    ext: ".css",
                    flatten: true
                } ]
            },
            pages: {
                files: [ {
                    expand: true,
                    cwd: paths.src + "/",
                    src: [ "**/*.scss", "!_**/*.scss" ],
                    dest: paths.dist + "/css/",
                    ext: ".css",
                    flatten: true
                } ]
            }
        },
        // https://github.com/DennisBecker/grunt-sass-globbing
        sass_globbing: {
            pages: {
                files: {
                    "src/sass/base/__base.scss": "src/sass/base/**/*.scss",
                    "src/sass/__components.scss": "src/components/**/*.scss",
                    "src/sass/__layouts.scss": "src/layouts/**/*.scss",
                    "src/sass/global/extends/__extends.scss": "src/sass/global/extends/**/*.scss",
                    "src/sass/global/functions/__functions.scss": "src/sass/global/functions/**/*.scss",
                    "src/sass/global/mixins/__mixins.scss": "src/sass/global/mixins/**/*.scss",
                    "src/sass/global/variables/__variables.scss": "src/sass/global/variables/**/*.scss"
                },
                options: {
                    useSingleQuotes: false
                }
            }
        },
        // https://github.com/nDmitry/grunt-postcss
        postcss: {
            options: {
                annotation: true,
                map: true,
                processors: [
                    require( "pixrem" )(), // Add fallbacks for rem units
                    require( "autoprefixer" )( {
                        browsers: [
                            "last 2 Chrome versions",
                            "Firefox >= 45",
                            "last 2 Safari versions",
                            "last 1 ie version",
                            "last 1 Edge version",
                            "last 4 iOS versions",
                            "last 3 Android versions"
                        ]
                    } ), //End auto prefixer
                    require( "cssnano" )() //Minify
                ]
            },
            dist: {
                expand: true,
                cwd: paths.dist + "/css/",
                src: "*.css",
                dest: paths.dist + "/css/",
            }
        },
        // https://www.npmjs.com/package/grunt-twig-render
        twigRender: {
            pages: {
                files: [ {
                    expand: true,
                    flatten: true,
                    data: paths.src + "/data.json",
                    cwd: paths.src + "/",
                    src: [ "**/*.twig", "!**/_*.twig" ],
                    dest: paths.dist + "/pages/",
                    ext: ".html"
                } ]
            }
        },
        // JavaScript Code Style
        // http://jscs.info/
        // https://npmjs.org/package/grunt-jscs
        jscs: {
            options: {
                config: ".jscsrc",
                fix: true // Autofix code style violations when possible.
            },
            jsSrc: [ "src/**/*.js" ]
        },
        // JavaScript minify
        // https://www.npmjs.com/package/grunt-contrib-uglify
        uglify: {
            options: {
                mangle: {
                    except: [ "$", "jQuery" ]
                },
                sourceMap: true
            },
            all: {
                files: [ {
                    cwd: paths.src + "/",
                    src: [ "**/*.js", "!**/*.min.js" ],
                    dest: paths.dist + "/js",
                    expand: true,
                    flatten: true,
                    extDot: "last",
                    ext: ".min.js"
                } ]
            }
        },
        // Wrap in Drupal behaviors
        // https://www.npmjs.com/package/grunt-banner
        usebanner: {
            jsBanner: {
                options: {
                    position: "top",
                    banner: "(function(window,$,rh,undefined){Drupal.behaviors.test={" +
                        "attach:function(context,settings){rh.test={};\n"
                },
                files: {
                    src: [ "dist/js/*.js" ]
                }
            },
            jsFooter: {
                options: {
                    position: "bottom",
                    linebreak: false,
                    banner: "\n}};})(window,jQuery,('undefined'==typeof rh)?{}:rh);"
                },
                files: {
                    src: [ "dist/js/*.js" ]
                }
            }
        },
        // Connect server for hologram
        // https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            server: {
                options: {
                    livereload: 1337,
                    port: 9001,
                    hostname: "0.0.0.0",
                    base: "dist",
                    open: {
                        target: "http://localhost:9001/pages" // Target url to open
                    }
                }
            }
        },
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            sass: {
                files: [ paths.src + "/sass/**/*.scss" ],
                tasks: [ "sass_globbing", "sass:global", "postcss" ]
            },
            sassPages: {
                files: [ paths.src + "/**/*.scss" ],
                tasks: [ "sass:pages", "postcss" ]
            },
            templates: {
                files: [ paths.src + "/**/*.twig", paths.src + "/**/*.json" ],
                tasks: [ "twigRender" ]
            },
            images: {
                files: [ paths.src + "/images/*.{png,jpg,gif}" ],
                tasks: [ "copy:images" ]
            },
            js: {
                files: [ paths.src + "/**/*.js" ],
                tasks: [ "js" ]
            }
        }
    } );
    
    grunt.registerTask( "js", "JS compile tasks.", function() {
        grunt.task.run( [
            "jscs",
            "uglify",
            "usebanner:jsBanner",
            "usebanner:jsFooter"
        ] );
    } );

    // Default task compiles a distributable copy of the repo
    grunt.registerTask( "default", [
        "clean", // files
        "copy", // images
        "twigRender", // images
        "sass_globbing", // sass
        "sass", // sass
        "postcss", // sass
        "js", // js
    ] );

    grunt.registerTask( "watcher", [
        "default",
        "connect",
        "watch"
    ] );
};
