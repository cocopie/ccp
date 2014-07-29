/*
 * Grunt File Concat CMD
 * */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('xiangmai.weke-mobile.json'),
        //合并文件
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: ['resources/js/src/**/*.js'],
                dest: 'resources/js/debug/app.js'
            }
        },
        //压缩文件
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            dist: { //按源文件目录结构压缩JS文件
                files: [
                    {
                        expand: true,
                        cwd: 'resources/js/debug/',
                        src: ['**/*.js'],
                        dest: 'resources/js/dist/',
                        ext: '.min.js'
                    }
                ]
            }
        },
        //编译less文件到lessCss文件夹
        less: {
			dev: {
                options: {
                    paths: ["resources/lessCss"],
                    cleancss: false
                },
                files: {
                    "resources/lessCss/style.css": "resources/less/style.less"
                }
            },
            production: {
                options: {
                    paths: ["resources/lessCss/"],
                    cleancss: true
                },
                files: {
                    "resources/lessCss/style.css": "resources/less/style.less"
                }
            }
		},
        //编译coffeeScript 到 js文件夹
        coffee: {
            compile: {
                options: {
                    sourceMap: true,
                    sourceMapDir: 'resources/js/maps/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'resources/coffee/',
                        src: ['**/*.coffee'],
                        dest: 'resources/js/src',
                        ext: '.js'
                    }
                ]
            }
        },
        //监听文件变化
        watch: {
            scripts: {
                files: ['resources/js/src/**/*.js'],
                tasks: ['concat', 'uglify']
            },
			less: {files: ["resources/less/**/*.less"],tasks: ["less:dev"]},
			coffee: {files: ["resources/coffee/**/*.coffee"],tasks: ["coffee"]}
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-coffee");

    //注册监听文件变化
    grunt.registerTask('dev', ['watch']);

    //监听less文件
   	grunt.registerTask("dev-less", ["watch:less"]); 

    //监听coffeeScript文件
    grunt.registerTask("dev-coffee", ["watch:coffee"]); 

    //注册打包事件
    grunt.registerTask('production', [
		"less:production", 
		"coffee", 
		'concat', 
		'uglify' 
	]);

};
