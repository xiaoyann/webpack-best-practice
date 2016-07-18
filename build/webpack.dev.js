/**
 * node webpack.dev.js
 *        --hot         开启热更新
 *        --uglify      压缩 
 *        --deploy      发布到测试环境，只发送 html 页面到服务器，js, css, img 等静态资源还是使用本地的，
 *        这样就可以在访问测试机时也可以照常使用热替换、自动刷新功能。
 *
 * NODE_ENV=development node build/webpack.dev.js --hot
 * NODE_ENV=development node build/webpack.dev.js --hot --deploy
 * NODE_ENV=production node build/webpack.dev.js --uglify
 */

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var DeployPlugin = require('./deploy.plugin');
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
  // 注意这里 loaders[0] 是处理 .js 文件的 loader
  config.module.loaders[0].loaders.unshift('react-hot');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

// 是否发布到测试环境
if (deploy === true) {
  // config.plugins.push(
  //   new DeployPlugin({
  //     user: '',
  //     password: '', 
  //     host: '', 
  //     keepalive: 10000000
  //   }, 
  //   [{reg: /html$/, to: '/xxx/xxx/xxx/app/views/'}])
  // );
}

// see http://webpack.github.io/docs/build-performance.html#sourcemaps
config.devtool = '#eval-cheap-module-source-map';

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



