'use strict';

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
require('time-grunt')(grunt);

// Automatically load required Grunt tasks
require('jit-grunt')(grunt);
 
    
require('jit-grunt')(grunt, {
  useminPrepare: 'grunt-usemin'
});   


// Define the configuration for all the tasks
grunt.initConfig({
	//从package.json中加载所有的grunt插件
    pkg: grunt.file.readJSON('package.json'),

    //jshint
	// Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
        },
        all: {
            src: [
                'Gruntfile.js',
                'src/js/{,*/}*.js', //这是一种很暴力的方式
                'src/views/js/{,*/}*.js'
              ]
        }
    },

	//clean
    clean: {
        build: {
            src: ['dist/']
        }
    },

    //useminPrepare
    useminPrepare: {
        html: [
            'src/index.html',
			'src/project-2048.html',
            'src/project-mobile.html',
            'src/project-webperf.html',
			'src/views/pizza.html'
        ],
        options: {
            dest: 'dist'
        }
    },

    //Concat
    concat: {
        options: {
            separator: ';'
        },
        // dist configuration is provided by useminPrepare
        dist: {}
    },
	
    //cssmin
	// Minify , Compress the css
    cssmin: {
		dist: {},
        views: {
            files: {
                'dist/css/style.min.css': ['src/css/style.css'],
                'dist/views/css/pizza.min.css': ['src/views/css/style.css', 'src/views/css/bootstrap-grid.css']
            }
        }
		//				'dist/css/style.min.css': ['src/css/style.css'],
        // dist configuration is provided by useminPrepare
        // common_target: {
        //     files: [{
        //         expand: true,
        //         cwd: 'src/css',
        //         src: ['*.css', '!*.min.css'],
        //         dest: 'dist/css',
        //         ext: '.min.css'
        //     }]
        // },
        // views: {
        //     files: {
        //         'dist/views/css/pizza.min.css': ['src/views/css/style.css', 'src/views/css/bootstrap-grid.css']
        //     }
        // }
    },

    //Uglify   
	// Minify , Compress the js
    uglify: {
	    dist: {},
        views: {
            files: {   //先提前生成js文件，供后面processhtml使用
                'dist/views/js/main.min.js': ['src/views/js/main.js']
            }	
        }
		
        // dist configuration is provided by useminPrepare
        // common_target: {
        //     files: [{
        //         expand: true,
        //         cwd: 'src/js',
        //         src: ['**/*.js', '!*.min.js'],
        //         dest: 'dist/js',
        //         ext: '.min.js'
        //     }]
        // },
        //This configuration will compress and mangle the input files using the default options.
        // views: {
        //     files: {
        //         'dist/views/js/pizza.min.js': ['src/views/js/main.js']
        //     }
        // }
    },

    //copy
    copy: {
        dist: {       //对于其他的资源文件，例如图片 进行COPY
            cwd: 'src',
            src: ['**', '!css/**/*.css', '!views/css/**/*.css', '!js/**/*.js', '!views/js/**/*.js'], //'!*.html', 
            dest: 'dist',
            expand: true
        }
    },
	
	//filerev
	//Static file asset revisioning through content hashing
    filerev: {
        options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 20
        },
        release: {
            // filerev:release hashes(md5) all assets (images, js and css )
            // in dist directory
            files: [{
                src: [
                    'dist/css/*.css',
                    'dist/views/css/*.css',
                    'dist/js/*.js',
                    'dist/views/js/*.js'
                ]
            }]
        }
    },
    
	// Usemin
    // Replaces all assets with their revved version in html and css files.
    // options.assetDirs contains the directories for finding the assets
    // according to their relative paths
    usemin: {
        html: ['dist/*.html', 'dist/views/*.html'],
        css: ['dist/css/*.css', 'dist/views/css/*.css'],
		JavaScript: ['dist/js/*.js', 'dist/views/js/*.js'],
        options: {
            assetsDirs: ['dist', 'dist/css', 'dist/js', 'dist/views', 'dist/views/css', 'dist/views/js']
        }
    },
	
	//processhtml
    processhtml: {
        views: {
            files: {
				'dist/index.html': ['dist/index.html'],
				'dist/project-2048.html': ['dist/project-2048.html'],
				'dist/project-mobile.html': ['dist/project-mobile.html'],
				'dist/project-webperf.html': ['dist/project-webperf.html'],
                'dist/views/pizza.html': ['dist/views/pizza.html']
            }
        }
    },
	
	//htmlmin
	htmlmin: { // Task 
        dist: { // Target 
            options: { // Target options 
                removeComments: true,
                collapseWhitespace: true,
                removeCommentsFromCDATA: true,
                minifyJS: true,
                minifyCSS: true
            },
            files: { // Dictionary of files 
                'dist/index.html': 'dist/index.html',
                'dist/project-2048.html': 'dist/project-2048.html',
                'dist/project-mobile.html': 'dist/project-mobile.html',
                'dist/project-webperf.html': 'dist/project-webperf.html',
                'dist/views/pizza.html': 'dist/views/pizza.html'
            }
        }
    },
	
	//connect     for   livereload Preview
	connect: {
		options: {
			port: 9000,
			// Change this to '0.0.0.0' to access the server from outside.
			hostname: 'localhost',
			livereload: 35729
		},
		
		dist: {
			options: {
				open: true,
				base: {
					path: 'dist',
					options: {
						index: 'index.html',
						maxAge: 300000
					}
				}
			}
		}
	},
	
	//watch       for   livereload Preview
	watch: {
        copy: {
            files: ['src/**', '!src/**/*.css', '!src/**/*.js'],
            tasks: ['build']
        },

        scripts: {
            files: ['src/js/*.js', 'src/views/js/*.js'],
            tasks: ['build']
        },

        styles: {
            files: ['src/css/*.css', 'src/views/css/*.css'],
            tasks: ['build']
        },

        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },

            files: [
                'src/{,*/}*.html',
                '.tmp/css/{,*/}*.css',
                'src/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    },
    pagespeed: {
        options: {
            nokey: true,
            url: "https://developers.google.com"
        },
        prod: {
            options: {
                url: "https://developers.google.com/speed/docs/insights/v1/getting_started",
                locale: "en_GB",
                strategy: "desktop",
                threshold: 80
            }
        },
        paths: {
            options: {
                paths: ["/speed/docs/insights/v1/getting_started", "/speed/docs/about"],
                locale: "en_GB",
                strategy: "desktop",
                threshold: 80
            }
        }
    }
});

grunt.registerTask('build', [
     'clean',
     'jshint',
     'useminPrepare',
     'concat',
     'cssmin',
     'uglify',
     'copy',         //复制一些资源文件，图片
	 'usemin',       //用加密后的文件名同步到*.html
     'processhtml', //可以把js文件生成放入html中
//     'filerev',      //给文件名加密
     'htmlmin'       //这样做是做好的办法，会是生成的html最小
]);
    
grunt.registerTask('serve',['build','connect:dist','watch']);

grunt.registerTask('pagespeed',['build', 'pagespeed']);
    
grunt.registerTask('default',['build']);
    
};  