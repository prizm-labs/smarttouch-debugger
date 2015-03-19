Package.describe({
  name: 'prizm:smarttouch-debugger',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  api.addFiles(["vendor/lodash/dist/lodash.min.js",
    "vendor/jquery/dist/jquery.min.js",
    "vendor/screenfull/dist/screenfull.js",
    "vendor/pixi.js/bin/pixi.js",
    "vendor/gsap/src/minified/TweenLite.min.js"
    ],['client']);

  api.addFiles(['scripts/client.js','scripts/table.js'],['client']);

  api.addFiles(['prizm:smarttouch-debugger.js'],['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('prizm:smarttouch-debugger');
  api.addFiles('prizm:smarttouch-debugger-tests.js');
});
