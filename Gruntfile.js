/**
 * Created by clicklabs on 24/5/16.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        serve: {
            options: {
                port: 9000
            }
        }
    });

    grunt.loadNpmTasks('grunt-serve');

    // Default task(s).
    grunt.registerTask('default', ['grunt-serve']);

};