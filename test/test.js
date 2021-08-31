/* eslint-env node, mocha */

const expect = require('chai').expect;
const fs = require('fs');

describe('ember-cli-environment-config-replace', function() {
  it('works', function () {
    const propNameGroup = '([\\w-]+)';
    const propValueGroup = '([\\w->]+)';
    const expectedProps = {
      environment: 'development',
      foo: 'FOO',
      'bar-baz': 'BAR->BAZ',
      qux: 'false',
      quux: '123'
    };

    const tests = [
      [
        './dist/index.html',
        `<output id="${propNameGroup}">${propValueGroup}</output>`,
        expectedProps,
      ],
      [
        './dist/tests/index.html',
        `<output id="${propNameGroup}">${propValueGroup}</output>`,
        { ...expectedProps, environment: 'test' },
      ],
      [
        './dist/assets/dummy.css',
        `--${propNameGroup}: "${propValueGroup}";`,
        expectedProps,
      ],
    ];

    tests.forEach(([filePath, regexStr, expectedProps]) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const regex = new RegExp(regexStr, 'g');
      const matches = Array.from(content.matchAll(regex));
      const actualProps = matches.reduce((acc, [/*match*/, group1, group2]) => {
        acc[group1] = group2;
        return acc;
      }, {});

      expect(actualProps, filePath).to.deep.equal(expectedProps);
    });
  });
});
