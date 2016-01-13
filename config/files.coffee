###
Exports a function which returns an object that overrides the default &
plugin file patterns (used widely through the app configuration)

To see the default definitions for Lineman's file paths and globs, see:

- https://github.com/linemanjs/lineman/blob/master/config/files.coffee
###

module.exports = (lineman) ->

  # copy bootstrap icons
  lineman.config.application.copy.dist.files.push
    expand: true
    cwd: "node_modules/bootstrap/fonts"
    src: "**"
    dest: 'dist/fonts'
  lineman.config.application.copy.dev.files.push
    expand: true
    cwd: "node_modules/bootstrap/fonts"
    src: "**"
    dest: 'generated/fonts'

  # Override file patterns here
  js:
    vendor: [
      "node_modules/angular/angular.js"
      "node_modules/angular-resource/angular-resource.js"
      "node_modules/angular-route/angular-route.js"
      "node_modules/angular-visor/release/visor.js"
      "node_modules/ng-table/dist/ng-table.js"
      "node_modules/ngstorage/ngStorage.js"
      "node_modules/moment/min/moment-with-locales.js"
      "node_modules/angular-strap/dist/angular-strap.js"
      "node_modules/angular-strap/dist/angular-strap.tpl.js"
      "node_modules/angular-gettext/dist/angular-gettext.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/**/*.js"
    ]

  css:
    vendor: [
      "node_modules/ng-table/dist/ng-table.css"
    ]
