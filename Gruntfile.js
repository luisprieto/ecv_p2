module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jsdoc : {
            dist : {
                jsdoc: './node_modules/.bin/jsdoc',
                options: {
                    destination: 'docs',
                    template: './node_modules/minami',
                    configure: './conf.json'
                }
            }
        },
        clean: ["docs"]
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['clean', 'jsdoc']);
};