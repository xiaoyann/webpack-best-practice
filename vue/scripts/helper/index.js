const config = require('../../config')
const env = process.env.NODE_ENV
const isProd = env === 'production'

exports.getHost = function() {
  const os = require('os')
  let IPv4 = '127.0.0.1'
  let interfaces = os.networkInterfaces()
  for (let key in interfaces) {
    interfaces[key].some(function(details){
      if (details.family == 'IPv4' && key == 'en0') {
        IPv4 = details.address
        return true
      }
    })
  }
  return IPv4
}

exports.htmlPluginOptions = function() {
  const options = {
    filename: 'index.html',
    template: './index.html',
    apiPath: config.apiPath,
    appVersion: config.version
  }

  if (isProd) {
    // https://github.com/kangax/html-minifier#options-quick-reference
    options.minify = {
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true
    }
  }

  return options
}

exports.alias = function() {
  const alias = {}
  config.alias.forEach(function(name) {
    alias[name] = config.root + '/src/' + name
  })
  return alias
}

exports.cssLoaders = function(name, extract) {
  let loaders = [
      {
      loader: 'css-loader',
      options: {
        sourceMap: false,
        minimize: isProd
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: false,
      }
    },
  ]

  if (name !== 'css') {
    loaders.push({
      loader: name + '-loader',
      options: {
        sourceMap: false
      }
    })
  }

  if (!isProd) {
    loaders.unshift('style-loader')
  } else {
    loaders = extract.extract({use: loaders})
  }

  return loaders
}
