'use strict';

const flatten = require('flat');
const ConfigReplace = require('broccoli-config-replace');
const MergeTrees = require('broccoli-merge-trees');

const packageName = require('./package').name;

// They are hardcoded in ember-cli and cannot be customized.
const TEST_DIR = 'tests/';
const TEST_INDEXHTML = `${TEST_DIR}index.html`;

module.exports = {
  name: packageName,
  _options: null,

  included() {
    this._super.included.apply(this, arguments);

    const appOptions = this.app.options;
    this._options = Object.assign({
      enabled: true,
      files: [appOptions.outputPaths.app.html, TEST_INDEXHTML],
      regex: /@\{\s?([\w-.]+)\s?\}/g
    }, appOptions[packageName]);
  },

  postprocessTree(type, tree) {
    if (this._options.enabled && type === 'all') {
      return this._processTree(tree);
    }

    return tree;
  },

  _processTree(tree) {
    const trees = [tree];

    let files = this._options.files;
    if (typeof files === 'function') {
      files = files(this.app.options.outputPaths);
    }

    const appFiles = [];
    const testFiles = [];
    files.forEach(filePath => {
      const filesRef = filePath.startsWith(TEST_DIR) ? testFiles : appFiles;
      filesRef.push(filePath);
    });

    if (appFiles.length > 0) {
      trees.push(this._envConfigReplace(tree, this.app.env, appFiles));
    }

    const hasTests = this.app.tests && this.app.trees.tests;
    if (hasTests && testFiles.length > 0) {
      trees.push(this._envConfigReplace(tree, 'test', testFiles));
    }

    return new MergeTrees(trees, { overwrite: true });
  },

  _envConfigReplace(tree, environment, files) {
    const app = this.app;
    const configNode = app._defaultPackager.packageConfig();
    const configPath = `${app.name}/config/environments/${environment}.json`;

    let flatConfig;
    const propertyMatchRegex = this._options.regex;
    const propertyReplacementFunc = function(config, ...stringReplaceArgs) {
      flatConfig = flatConfig || flatten(config, { safe: true });
      const [match, propertyPath] = stringReplaceArgs;
      if (propertyPath in flatConfig) {
        return flatConfig[propertyPath];
      } else {
        return match;
      }
    };

    const configReplaceTree = new ConfigReplace(tree, configNode, {
      annotation: `ConfigReplace (${environment} environment config)`,
      configPath,
      files,
      patterns: [{
        match: propertyMatchRegex,
        replacement: propertyReplacementFunc
      }]
    });

    return configReplaceTree;
  }
};
