module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		watch: {
			livereload: {
				options: {
					livereload: true
				},
				files: ['index.html', 'slides/*.md', 'slides/*.html', 'js/*.js', 'css/_timmy.css']
			},
			index: {
				files: ['templates/_index.html', 'templates/_section.html', 'slides/list.json'],
				tasks: ['buildIndex']
			},
			jshint: {
				files: ['js/*.js'],
				tasks: ['jshint']
			},
			css: {
				files: ['css/_*.css'],
				tasks: ['autoprefixer']
			}
		},
		autoprefixer: {
			theme: {
				options: {
					map: true
				},
				files: {
					'css/timmy.css': 'css/_timmy.css'
				}
			}
		},
		bowercopy: {
			options: {
				clean: true
			},
			css: {
				options: {
					destPrefix: 'css'
				},
				files: {
					'zenburn.css': 'reveal.js/lib/css/zenburn.css',
					'reveal.min.css': 'reveal.js/css/reveal.min.css',
					'print': 'reveal.js/css/print',
					'font': 'reveal.js/lib/font'
				}
			},
			libs: {
				options: {
					destPrefix: 'js/libs'
				},
				files: {
					'head.min.js': 'reveal.js/lib/js/head.min.js',
					'reveal.min.js': 'reveal.js/js/reveal.min.js'
				}
			},
			plugins: {
				options: {
					destPrefix: 'js/plugins'
				},
				files: {
					'classList.js': 'reveal.js/lib/js/classList.js',
					'markdown': 'reveal.js/plugin/markdown',
					'highlight.js': 'reveal.js/plugin/highlight/highlight.js',
					'zoom.js': 'reveal.js/plugin/zoom-js/zoom.js',
					'search.js': 'reveal.js/plugin/search/search.js',
					'notes': 'reveal.js/plugin/notes',
					'remotes.js': 'reveal.js/plugin/remotes/remotes.js'
				}
			}
		},
		connect: {
			livereload: {
				options: {
					port: 9000,
					hostname: 'localhost',
					base: '.',
					open: true,
					livereload: true
				}
			}
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						src: ['slides/**', 'bower_components/**', 'js/**'],
						dest: 'dist/'
					}, {
						expand: true,
						src: ['index.html'],
						dest: 'dist/',
						filter: 'isFile'
					}
				]
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['js/*.js']
		}
	});

	grunt.registerTask('buildIndex', 'Build index.html from templates/_index.html and slides/list.json.', function() {
		var indexTemplate = grunt.file.read('templates/_index.html');
		var sectionTemplate = grunt.file.read('templates/_section.html');
		var slides = grunt.file.readJSON('slides/list.json');

		var html = grunt.template.process(indexTemplate, {
			data: {
				slides: slides,
				section: function(slide) {
					return grunt.template.process(sectionTemplate, {
						data: {
							slide: slide
						}
					});
				}
			}
		});
		return grunt.file.write('index.html', html);
	});

	grunt.registerTask('test', 'Compile *CSS*. Lint *javascript* files.', ['autoprefixer', 'jshint']);
	grunt.registerTask('server', 'Run presentation locally and start watch process (living document).', ['buildIndex', 'connect:livereload', 'watch']);
	grunt.registerTask('dist', 'Save presentation files to *dist* directory.', ['test', 'buildIndex', 'copy']);

	return grunt.registerTask('default', ['test', 'server']);
};
