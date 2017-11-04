const path = require('path')
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

exports.alias = function(folders) {
  const alias = {}
  folders.forEach(function(name) {
    alias[name] = path.join(__dirname, '../../src', name)
  })
  return alias
}

exports.cssLoaders = function (name) {
  let loaders = [
    {
      loader: 'file-loader',
      options: {
        name: 'static/css/[name].[hash].css'
      }
    },
    {
      loader: 'extract-loader'
    },
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
        sourceMap: false
      }
    }
  ]

  if (name) {
    loaders.push({
      loader: name + '-loader',
      options: {
        sourceMap: false
      }
    })
  }

  return loaders
}
