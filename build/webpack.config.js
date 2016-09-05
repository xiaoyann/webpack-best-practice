var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');

// 辅助函数
var utils = require('./utils');
var fullPath  = utils.fullPath;
var pickFiles = utils.pickFiles;

// 项目根路径
var ROOT_PATH = fullPath('../');
// 项目源码路径
var SRC_PATH = ROOT_PATH + '/src';
// 产出路径
var DIST_PATH = ROOT_PATH + '/dist';

// node_modules
var NODE_MODULES_PATH =  ROOT_PATH + '/node_modules';

var __DEV__ = process.env.NODE_ENV !== 'production';

var args = process.argv;
var uglify = args.indexOf('--uglify') > -1;


// conf
// import api from 'conf/api';
var alias = pickFiles({
  id: /(conf\/[^\/]+).js$/,
  pattern: SRC_PATH + '/conf/*.js'
});

// components
// import Alert from 'components/alert';
alias = Object.assign(alias, pickFiles({
  id: /(components\/[^\/]+)/,
  pattern: SRC_PATH + '/components/*/index.js'
}));

// reducers
// import reducers from 'reducers/index';
alias = Object.assign(alias, pickFiles({
  id: /(reducers\/[^\/]+).js/,
  pattern: SRC_PATH + '/js/reducers/*'
}));

// actions
// import actions from 'actions/index';
alias = Object.assign(alias, pickFiles({
  id: /(actions\/[^\/]+).js/,
  pattern: SRC_PATH + '/js/actions/*'
}));

alias = Object.assign(alias, {
  'react-router': NODE_MODULES_PATH + '/react-router/lib/index.js',
  'react-redux': NODE_MODULES_PATH + '/react-redux/lib/index.js',
  'redux': NODE_MODULES_PATH + '/redux/lib/index.js',
  'redux-thunk': NODE_MODULES_PATH + '/redux-thunk/lib/index.js'
});


var config = {
  context: SRC_PATH,
  entry: {
    app: [SRC_PATH + '/pages/app.js'],
    lib: [
      'react', 'react-dom', 'react-router',
      'redux', 'react-redux', 'redux-thunk'
    ],
  },
  output: {
    path: DIST_PATH,
    // chunkhash 不能与 --hot 同时使用
    // see https://github.com/webpack/webpack-dev-server/issues/377
    filename: __DEV__ ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    chunkFilename: __DEV__ ? 'js/[name].js' : 'js/[name].[chunkhash].js'
  },
  module: {},
  resolve: {
    root: SRC_PATH,
    alias: alias
  },
  plugins: [
    new webpack.DefinePlugin({
      // http://stackoverflow.com/questions/30030031/passing-environment-dependent-variables-in-webpack
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['lib', 'manifest']
    }),
    // 使用文件名替换数字作为模块ID
    // new webpack.NamedModulesPlugin(),
    // 使用 hash 作模块 ID，文件名作ID太长了，文件大小剧增
    new HashedModuleIdsPlugin(),
    // 根据文件内容生成 hash
    new WebpackMd5Hash()
  ]
};


// loaders
var CACHE_PATH = ROOT_PATH + '/cache';
config.module.loaders = [];

// 使用 babel 编译 jsx、es6
config.module.loaders.push({
  test: /\.js$/,
  exclude: /node_modules/,
  // 这里使用 loaders ，因为后面还需要添加 loader
  loaders: ['babel?cacheDirectory=' + CACHE_PATH]
});

// 编译 sass
if (__DEV__) {
  config.module.loaders.push({
    test: /\.(scss|css)$/,
    loaders: ['style', 'css', 'postcss', 'sass']
  });
} else {
  config.module.loaders.push({
    test: /\.(scss|css)$/,
    loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
  });
  config.plugins.push(
    new ExtractTextPlugin('css/[name].[contenthash].css')
  );
}

// css autoprefix
var precss = require('precss');
var autoprefixer = require('autoprefixer');
config.postcss = function() {
  return [precss, autoprefixer];
}

// 图片路径处理，压缩
config.module.loaders.push({
  test: /\.(?:jpg|gif|png|svg)$/,
  loaders: [
    'url?limit=8000&name=img/[hash].[ext]',
    'image-webpack'
  ]
});

// 压缩 js, css
if (uglify) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  );
}

// 去掉重复模块
if (!__DEV__) {
  config.plugins.push(
    new webpack.optimize.DedupePlugin()
  );
}

// html 页面
var HtmlwebpackPlugin = require('html-webpack-plugin');
config.plugins.push(
  new HtmlwebpackPlugin({
    filename: 'index.html',
    chunks: ['app', 'lib'],
    template: SRC_PATH + '/pages/app.html',
    minify: __DEV__ ? false : {
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeComments: true
    }
  })
);

// 内嵌 manifest 到 html 页面
config.plugins.push(function() {
  this.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
      var manifest = '';
      Object.keys(compilation.assets).forEach(function(filename) {
        if (/\/?manifest.[^\/]*js$/.test(filename)) {
          manifest = '<script>' + compilation.assets[filename].source() + '</script>';
        }
      });
      if (manifest) {
        var htmlSource = file.html.source();
        htmlSource = htmlSource.replace(/(<\/head>)/, manifest + '$1');
        file.html.source = function() {
          return htmlSource;
        };
      }
      callback(null, file);
    });
  });
});

module.exports = config;




