const webpack = require('webpack')
const Server = require('webpack-dev-server')
const config = require('./config/dev')
const helper = require('./helper')

const port = 8080
const host = helper.getHost()
const address = `http://${host}:${port}`
const useHotReload = false
const entryMixins = [
  // bundle the client for webpack-dev-server
  // and connect to the provided endpoint
  'webpack-dev-server/client?' + address
]


if (useHotReload) {
  // bundle the client for hot reload
  // only- means to only hot reload for successful updates
  entryMixins.push('webpack/hot/only-dev-server')
  // activates HMR
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  // prints more readable module names in the browser console on HMR updates
  config.plugins.push(new webpack.NamedModulesPlugin())
}

config.entry['app'] = entryMixins.concat(config.entry['app'])


const server = new Server(webpack(config), {
  hot: useHotReload,
  stats: { colors: true, chunks: false, modules: false },
  disableHostCheck: true
})

server.listen(port, undefined, function() {
  console.log('\n ==> '+ address +' \n')
})


// start mock server
require('../mock/app')(server.app)
