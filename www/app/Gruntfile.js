module.exports = function(grunt) {
  //required modules
  requiredModules = {
    js: [
      'node_modules/angular/angular.min.js',
      'node_modules/@uirouter/angularjs/release/angular-ui-router.min.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'node_modules/angular-sanitize/angular-sanitize.min.js',
      'node_modules/marked/lib/marked.js',
      'node_modules/angular-marked/dist/angular-marked.js',
      'node_modules/angular-flash-alert/dist/angular-flash.min.js',
      'node_modules/ng-tags-input/build/ng-tags-input.min.js'
    ],
    css: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/ng-tags-input/build/ng-tags-input.bootstrap.min.css',
      'node_modules/ng-tags-input/build/ng-tags-input.min.css',
      'node_modules/open-iconic/font/css/open-iconic-bootstrap.min.css'
    ],
    fonts: [
      'node_modules/open-iconic/font/fonts/**',
      'node_modules/bootstrap/dist/fonts/**'
    ],
    img: [
      'node_modules/open-iconic/svg/**',
    ]
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/assets/js/*.js', 'src/components/**/*.js']
    },
    concat: {
      options: { seperator: ';' },
      dist: {
        src: ['src/assets/js/**.js', 'src/components/**/*.js'],
        dest: 'dist/assets/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: { banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n', mangle: false },
      dist: {
        files: {
          'dist/assets/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    less: {
      build: {
        options: { compress: true, optimization: 2 },
        files: { 'dist/assets/css/main.min.css': 'src/assets/less/main.less' }
      }
    },
    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'src', src: 'index.html', dest: 'dist' },
          { expand: true, cwd: 'src/components', src: '**/*.html', dest: 'dist/components', flatten: true },
          { expand: true, src: requiredModules.js, dest: 'dist/assets/lib/js', flatten: true },
          { expand: true, src: requiredModules.css, dest: 'dist/assets/lib/css', flatten: true },
          { expand: true, src: requiredModules.fonts, dest: 'dist/assets/lib/fonts', flatten: true },
          { expand: true, src: requiredModules.img, dest: 'dist/assets/lib/img', flatten: true },
          { expand: true, cwd: 'src/assets/img', src: '**/*', dest: 'dist/assets/img' },
          { expand: true, cwd: 'src/assets/data', src: '**/*', dest: 'dist/assets/data' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy', 'less']);
};
