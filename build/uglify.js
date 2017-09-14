var fs = require('fs');
var uglify = require('uglify-js');

module.exports = function(bundle, outputPath) {
  var result = uglify.minify(bundle.code, {
    mangle: true,
    compress: {
      unsafe: true
    },
    output: {
      comments: /^!/
    }
  });

  fs.writeFile(outputPath, result.code);
};
