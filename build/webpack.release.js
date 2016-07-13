var webpack = require('webpack');
var config = require('./webpack.config');

var args = process.argv;
var online = args.indexOf('--deploy=online') > -1;
var watch = args.indexOf('--watch') > -1;

// 测试环境静态资源 domain
var testPublicPath = '/';
// 生产环境静态资源 domain
var onlinePublicPath = '/';


if (online) {
  config.output.publicPath = onlinePublicPath; 
} else {
  config.output.publicPath = testPublicPath; 
}


// 压缩 js, css
config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);


var compiler = webpack(config);

function callback(err, stats) {
  if (err) {
    console.log(err);
  } else {
    console.log(stats.toString({
      colors: true,
      chunks: false,
      children: false,
    }))  
  }
}

if (watch) {
  compiler.watch({}, callback);
} else {
  compiler.run(callback);
}




