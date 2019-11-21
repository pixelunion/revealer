const fs = require('fs');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('uglify-js');
const pkg = require('../package.json');

const banner = `
  /*!
   * ${pkg.name} v${pkg.version}
   * (c) ${new Date().getFullYear()} ${pkg.author}
   * Released under the ${pkg.license} license.
  */
`;


const outputOptions = {
  es: {
    format: 'es',
    file: pkg.module,
    banner,
  },
  cjs: {
    format: 'cjs',
    file: pkg.main,
    banner,
  },
  umd: {
    format: 'umd',
    file: pkg.umd,
    name: pkg.umdName,
    banner,
  },
};

rollup.rollup({
  input: 'src/index.js',
  plugins: [
    babel(),
    commonjs(),
    resolve(),
  ],
}).then((bundle) => {
  bundle.write(outputOptions.es);
  bundle.write(outputOptions.cjs);

  bundle.generate(outputOptions.umd).then(({ output }) => {
    const minified = uglify.minify(output[0].code);

    fs.writeFileSync(outputOptions.umd.file, output[0].code);
    fs.writeFileSync(
      outputOptions.umd.file.replace('.js', '.min.js'),
      minified.code,
    );
  });
});
