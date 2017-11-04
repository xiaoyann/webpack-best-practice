require('shelljs/global')
env.NODE_ENV = 'production'

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const webpackConfig = require('./base')
const config = require('../../config')

module.exports = webpackMerge(webpackConfig, {
  plugins: [
    // compress js
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: { warnings: false }
    })
  ]
})

