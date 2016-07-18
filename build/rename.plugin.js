var fs = require('fs');
var path = require('path');
var md5 = require('md5');


function RenamePlugin() {
}

RenamePlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    var htmlFiles = [];
    var hashFiles = [];
    var assets = stats.compilation.assets;

    Object.keys(assets).forEach(function(fileName) {
      var file = assets[fileName];
      if (/\.(css|js)$/.test(fileName)) {
        var hash = md5(file.source());
        var newName = fileName.replace(/(.js|.css)$/, '.' + hash + '$1');
        hashFiles.push({
          originName: fileName,
          hashName: newName
        });
        if (file.emitted) {
          fs.rename(file.existsAt, file.existsAt.replace(fileName, newName));
        }   
      } 
      else if (/\.html$/) {
        htmlFiles.push(fileName);
      }
    });

    htmlFiles.forEach(function(fileName) {
      var file = assets[fileName];
      var contents = file.source();
      hashFiles.forEach(function(item) {
        contents = contents.replace(item.originName, item.hashName);
      });
      fs.writeFile(file.existsAt, contents, 'utf-8');
    });
  });
};

module.exports = RenamePlugin;