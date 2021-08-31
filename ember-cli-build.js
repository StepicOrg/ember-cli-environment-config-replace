'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

/*
  This build file specifies the options for the dummy test app of this
  addon, located in `/tests/dummy`
  This build file does *not* influence how the addon or the app using it
  behave. You most likely want to be modifying `./index.js` or app's build file
*/
module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-environment-config-replace': {
      files: outputPaths => [
        outputPaths.app.html,
        outputPaths.app.css.app,
        'tests/index.html',
      ]
    }
  });

  return app.toTree();
};
