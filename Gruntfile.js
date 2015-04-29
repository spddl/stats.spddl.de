module.exports = function(grunt) {

grunt.initConfig({
  htmlmin: {                                     // Task
    dist: {                                      // Target
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: true
      },
      files: {                                   // Dictionary of files
        'client/partials/frontpage.min.html': 'client/partials/frontpage.html',     // 'destination': 'source'
		'client/partials/raw.min.html': 'client/partials/raw.html',
		'client/partials/stats.min.html': 'client/partials/stats.html'
      }
    }
  },

  uglify: {
    serverjs: {
      files: {
        'server.min.js': ['server.js']
      }
    }
  }
});

grunt.registerTask('default', ['uglify', 'htmlmin'])
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-contrib-uglify');
};
