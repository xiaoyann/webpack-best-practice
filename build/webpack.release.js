/**
  node webpack.release.js
     --watch         实时发布
     --uglify        压缩 
     --deploy=test   发布到测试环境，默认选项
     --deploy=online 发布到生产环境

  NODE_ENV=production node build/webpack.release.js --watch --uglify --deploy=test 
  NODE_ENV=production node build/webpack.release.js --watch --uglify --deploy=online
*/

var webpack = require('webpack');
var config = require('./webpack.config');
var RenamePlugin = require('./rename.plugin');

var args = process.argv;
var watch = args.indexOf('--watch') > -1;
var online = args.indexOf('--deploy=online') > -1;

// 测试环境静态资源 domain
var testPublicPath = '/';
// 生产环境静态资源 domain
var onlinePublicPath = '/';

if (online) {
  config.output.publicPath = onlinePublicPath; 
} else {
  config.output.publicPath = testPublicPath; 
}

// config.plugins.push(new RenamePlugin());

var compiler = webpack(config);

function callback(err, stats) {
  if (err) {
    console.log(err);
  } else {
    console.log(stats.toString({
      colors: true,
      chunks: false,
      children: false,
    }));  
  }
}

if (watch) {
  compiler.watch({}, callback);
} else {
  compiler.run(callback);
}




