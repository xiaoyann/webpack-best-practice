const path = require('path')
const webpack = require('webpack')
const WebpackChunkHash = require('webpack-chunk-hash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const InlineManifestPlugin = require("inline-manifest-webpack-plugin")
const helper = require('../helper')
const config = require('../../config')
const env = process.env.NODE_ENV
const isProd = env === 'production'

const extractAppCss = new ExtractTextPlugin('css/app.[contenthash].css')
const extractLibCss = new ExtractTextPlugin('css/lib.[contenthash].css')

module.exports = {
  context: config.root + '/src',

  devtool: 'source-map',

  entry: {
    // application code
    app: [
      './main.js'
    ],
    // other libs code
    vendor: config.vendor
  },

  output: {
    path: config.root + '/dist',
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: isProd ? config.publicPath : '/'
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: helper.alias()
  },

  module: {
    rules: [
      {
        test: /\.tpl$/,
        // https://github.com/ktsn/vue-template-loader
        loader: 'vue-template-loader',
        options: {
          transformToRequire: {
            img: 'src'
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
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
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        use: helper.cssLoaders('css', extractLibCss)
      },
      {
        test: /\.styl$/,
        use: helper.cssLoaders('stylus', extractAppCss)
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

    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin(
      helper.htmlPluginOptions()
    ),

    // custom chunk hash
    // https://github.com/alexindigo/webpack-chunk-hash
    new WebpackChunkHash(),

    // using hash as module id instead of index
    new webpack.HashedModuleIdsPlugin(),

    extractAppCss,
    extractLibCss
  ],

  // does not polyfill or mock any Node api
  node: isProd ? false : {}
}
