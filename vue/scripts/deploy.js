const webpack = require('webpack')
const config = require('./config/prod')
const DeployPlugin = require('deploy-kit/plugins/sftp-webpack-plugin')

config.plugins.push(new DeployPlugin())

webpack(config).watch({
}, function(err, stats) {
  if (err) throw err
  console.log(stats.toString({
    colors: true,
    chunks: false,
    modules: false
  }))
})
