ember-cli-environment-config-replace
==============================================================================

Simple templating using `config/environment.js` at build time.


Installation
------------------------------------------------------------------------------

```
ember install ember-cli-environment-config-replace
```


Usage
------------------------------------------------------------------------------

This addon looks for a `@{PROP}` pattern in files and replaces it with a `PROP`
from `environment/config.js` at build time.

Nested properties are also supported, just use `.` as delimiter: `@{PROP.A.B.C}`.

Options and their defaults:

```js
let app = new EmberApp(defaults, {
  'ember-cli-environment-config-replace': {
    enabled: true,

    // A list of files to parse in `/dist` directory.
    // NOTE: The replacement happens in the `postprocessTree` hook, 
    // so its essentially running once the files have already been processed.
    files: [
      'index.html',
      'tests/index.html',
    ],

    // Regex pattern for replacements.
    // The regex must have a group to capture property name.
    regex: /@\{\s?([\w-.]+)\s?\}/g
  }
});
```

If `files` is a function, it's passed the
[`outputPaths`](https://cli.emberjs.com/release/advanced-use/asset-compilation/#configuringoutputpaths)
object. It's better to rely on this rather than hard-coding file paths, because output paths 
for some assets can be configured in ember-cli.

```js
'ember-cli-environment-config-replace': {
  files: outputPaths => [
    outputPaths.app.html,
    outputPaths.app.css.app,
  ]
}
```

Running tests
------------------------------------------------------------------------------

`npm test`
