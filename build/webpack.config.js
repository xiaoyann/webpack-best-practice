var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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

// conf
var alias = pickFiles({
  id: /(conf\/[^\/]+).js$/,
  pattern: SRC_PATH + '/conf/*.js'
});

// components
alias = Object.assign(alias, pickFiles({
  id: /(components\/[^\/]+)/,
  pattern: SRC_PATH + '/components/*/index.js'
}));

// reducers
alias = Object.assign(alias, pickFiles({
  id: /(reducers\/[^\/]+).js/,
  pattern: SRC_PATH + '/js/reducers/*'
}));

// actions
alias = Object.assign(alias, pickFiles({
  id: /(actions\/[^\/]+).js/,
  pattern: SRC_PATH + '/js/actions/*'
}));


var config = {
  context: SRC_PATH,
  entry: {
    app: ['./pages/app.js'],
    lib: [
      'react', 'react-dom', 'react-router',
      'redux', 'react-redux', 'redux-thunk'
    ],
  },
  output: {
    path: DIST_PATH,
    filename: 'js/[name].[hash].js'
  },
  module: {},
  resolve: {
    alias: alias
  },
  plugins: [
    new webpack.DefinePlugin({
      // http://stackoverflow.com/questions/30030031/passing-environment-dependent-variables-in-webpack
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.CommonsChunkPlugin('lib', 'js/[name].[hash].js')
  ]
};


// loaders
var CACHE_PATH = ROOT_PATH + '/cache';
config.module.loaders = [];

// 使用 babel 编译 jsx、es6
config.module.loaders.push({
  test: /\.js$/,
  exclude: /node_modules/,
  include: SRC_PATH,
  // 这里使用 loaders ，因为后面还需要添加 loader
  loaders: ['babel?cacheDirectory=' + CACHE_PATH]
});

// 编译 sass
if (__DEV__) {
  config.module.loaders.push({
    test: /\.(scss|css)$/,
    loaders: ['style', 'css', 'sass', 'postcss']
  });
} else {
  config.module.loaders.push({
    test: /\.(scss|css)$/,
    loader: ExtractTextPlugin.extract('style', 'css!sass!postcss')
  });
  config.plugins.push(
    new ExtractTextPlugin('css/[name].[hash].css')
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


module.exports = config;




