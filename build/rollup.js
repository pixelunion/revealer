var fs = require('fs');
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var uglify = require('./uglify');
var pkg = require('../package.json');

var banner =
  '/*!\n' +
  ' * ' + pkg.name + ' v' + pkg.version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' ' + pkg.author.name + '\n' +
  ' * Released under the ' + pkg.license + ' license.\n' +
  ' */'

rollup.rollup({
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**/*',
      presets: [
        ['env', { modules: false }]
      ],
      // plugins: ['external-helpers']
    })
  ]
}).then(function(bundle){

  // Write ES module bundle
  bundle.write({
    format: 'es',
    file: pkg.module,
    banner
  });

  // Write CommonJS bundle
  bundle.write({
    format: 'cjs',
    file: pkg.main,
    banner
  });

  // Write UMD bundles
  bundle.generate({
    format: 'umd',
    file: pkg.browser,
    name: pkg.name,
    banner
  }).then(function(output){
    fs.writeFile(pkg.browser, output.code);
    uglify(output, pkg.browser.replace('.js', '.min.js'));
  }).catch(warn);

}).catch(warn);

function warn(error) {
  console.log(error.stack);
}
