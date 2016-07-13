var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var utils = require('./utils');

var PORT = 8080;
var HOST = utils.getIP();

var args = process.argv;
var hot = args.indexOf('--hot') > -1;
var deploy = args.indexOf('--deploy') > -1;

// 本地环境静态资源路径
var localPublicPath = 'http://' + HOST + ':' + PORT + '/';

config.output.publicPath = localPublicPath; 
config.entry.app.unshift('webpack-dev-server/client?' + localPublicPath);

// 开启热替换相关设置
if (hot === true) {
  config.entry.app.unshift('webpack/hot/only-dev-server');
  config.module.loaders[0].loaders.unshift('react-hot');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

new WebpackDevServer(webpack(config), {
  hot: hot,
  inline: true,
  compress: true,
  stats: {
    chunks: false,
    children: false,
    colors: true
  },
  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: true,
}).listen(PORT, HOST, function() {
  console.log(localPublicPath);
});