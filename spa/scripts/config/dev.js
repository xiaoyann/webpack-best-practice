require('shelljs/global')
env.NODE_ENV = 'development'

var webpackMerge = require('webpack-merge')
var webpackConfig = require('./base')

module.exports = webpackMerge(webpackConfig, {
})
