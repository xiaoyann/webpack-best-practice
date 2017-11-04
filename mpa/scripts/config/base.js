const path = require('path')
const webpack = require('webpack')
const WebpackChunkHash = require('webpack-chunk-hash')
const InlineManifestPlugin = require("inline-manifest-webpack-plugin")
const helper = require('../helper')
const mixins = require('./mixins')

const env = process.env.NODE_ENV
const isProd = env === 'production'
const rootPath = path.resolve(__dirname, '../../')

module.exports = mixins({
  context: rootPath + '/src',

  devtool: 'source-map',

  entry: {
    vendor: './vendor.js'
  },

  output: {
    path: rootPath + '/dist',
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js'],
    alias: helper.alias(['css', 'images', 'js', 'pages', 'widgets'])
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['ejs-compiled-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // https://github.com/babel/babel-loader
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)(\?.*)?$/,
        // https://github.com/webpack-contrib/url-loader
        loader: 'url-loader?limit=5120&name=static/images/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        use: helper.cssLoaders('css')
      },
      {
        test: /\.styl$/,
        use: helper.cssLoaders('stylus')
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${env}"`
    }),

    new InlineManifestPlugin({
      name: 'webpackManifest',
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    }),

    // custom chunk hash
    // https://github.com/alexindigo/webpack-chunk-hash
    new WebpackChunkHash(),

    // using hash as module id instead of index
    new webpack.HashedModuleIdsPlugin(),
  ],

  // does not polyfill or mock any Node api
  node: isProd ? false : {}
})
