module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt);
  
    var paths = {
      src: "./src",
      dist: "./dist",
      tmp: "./tmp"
    };
  
    grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      // https://www.npmjs.com/package/grunt-contrib-clean
      clean: {
        assets: [paths.dist + "/*"],
        tmp: [paths.tmp],
        sassGlobbing: [paths.src + "/**/__*"]
      },
      copy: {
        images: {
          expand: true,
          cwd: paths.src + "/assets/",
          src: ["**/*.{png,jpg,gif}"],
          dest: paths.dist + "/"
        }
      },
      // https://github.com/sindresorhus/grunt-sass
      sass: {
        options: {
          implementation: require("node-sass"),
          includePaths: [paths.src + "/sass"],
          sourceMap: true,
          outputStyle: "expanded"
        },
        global: {
          files: [
            {
              expand: true,
              cwd: paths.src + "/sass/",
              src: ["default.scss"],
              dest: paths.dist + "/css/",
              ext: ".css",
              flatten: true
            }
          ]
        },
        pages: {
          files: [
            {
              expand: true,
              cwd: paths.src + "/",
              src: ["**/*.scss", "!_**/*.scss"],
              dest: paths.dist + "/css/",
              ext: ".css",
              flatten: true
            }
          ]
        }
      },
      // https://github.com/DennisBecker/grunt-sass-globbing
      sass_globbing: {
        pages: {
          files: {
            "src/sass/base/__base.scss": "src/sass/base/**/*.scss",
            "src/sass/__components.scss": "src/library/components/**/*.scss",
            "src/sass/__layouts.scss": "src/library/layouts/**/*.scss",
            "src/sass/global/extends/__extends.scss":
              "src/sass/global/extends/**/*.scss",
            "src/sass/global/functions/__functions.scss":
              "src/sass/global/functions/**/*.scss",
            "src/sass/global/mixins/__mixins.scss":
              "src/sass/global/mixins/**/*.scss",
            "src/sass/global/variables/__variables.scss":
              "src/sass/global/variables/**/*.scss"
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
            require("pixrem")(), // Add fallbacks for rem units
            require("autoprefixer")(), //End auto prefixer
            require("cssnano")() //Minify
          ]
        },
        dist: {
          expand: true,
          cwd: paths.dist + "/css/",
          src: "*.css",
          dest: paths.dist + "/css/"
        }
      },
      // https://www.npmjs.com/package/grunt-twig-render
      twigRender: {
        pages: {
          files: [
            {
              expand: true,
              flatten: true,
              data: paths.src + "/data.json",
              cwd: paths.src + "/",
              src: ["**/*.twig", "!**/_*.twig"],
              dest: paths.dist + "/",
              ext: ".html"
            }
          ]
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
        jsSrc: ["src/**/*.js"]
      },
      // JavaScript minify
      // https://www.npmjs.com/package/grunt-contrib-uglify
      uglify: {
        options: {
          mangle: {
            reserved: ["$", "jQuery"]
          },
          sourceMap: true
        },
        all: {
          files: [
            {
              cwd: paths.src + "/",
              src: ["**/*.js", "!**/*.min.js"],
              dest: paths.dist + "/js",
              expand: true,
              flatten: true,
              extDot: "last",
              ext: ".min.js"
            }
          ]
        }
      },
      // https://github.com/treasonx/grunt-markdown
      markdown: {
        intro: {
          files: [
            {
              src: ["README.md"],
              dest: paths.dist + "/",
              expand: true,
              flatten: true,
              rename: function (dest, src) {
                return dest + src.replace("README", "index");
              },
              ext: ".html"
            }
          ]
        },
        tests: {
          files: [
            {
              cwd: paths.src + "/",
              src: ["example*/**/*.md"],
              dest: paths.dist + "/instructions/",
              expand: true,
              flatten: true,
              ext: ".html"
            }
          ]
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
              target: "http://localhost:9001" // Target url to open
            }
          }
        }
      },
      // https://github.com/gruntjs/grunt-contrib-watch
      watch: {
        options: {
          livereload: {
            host: "localhost",
            port: 1337
          }
        },
        sass: {
          files: [paths.src + "/sass/**/*.scss"],
          tasks: ["sass_globbing", "sass:global", "postcss"]
        },
        sassPages: {
          files: [paths.src + "/**/*.scss"],
          tasks: ["sass:pages", "postcss"]
        },
        templates: {
          files: [paths.src + "/**/*.twig", paths.src + "/**/*.json"],
          tasks: ["twigRender"]
        },
        images: {
          files: [paths.src + "/images/*.{png,jpg,gif}"],
          tasks: ["copy:images"]
        },
        js: {
          files: [paths.src + "/**/*.js"],
          tasks: ["js"]
        },
        md: {
          files: ["**/*.md"],
          tasks: ["markdown"]
        }
      }
    });
  
    grunt.registerTask("js", "JS compile tasks.", function () {
      grunt.task.run(["jscs", "uglify"]);
    });
  
    // Default task compiles a distributable copy of the repo
    grunt.registerTask("default", [
      "clean", // files
      "copy", // images
      "twigRender", // templates
      "sass_globbing", // sass
      "sass", // sass
      "postcss", // sass
      "js", // js
      "markdown" // instructions
    ]);
  
    grunt.registerTask("watcher", ["default", "connect", "watch"]);
  };
  