const package = require('./package.json')

// 应用版本
exports.version = package.version

// 接口地址
exports.apiPath = ''

// 项目根路径
exports.root = __dirname

// 别名
exports.alias = [
  'css', 'images', 'js', 'views', 'components'
]

// vendor lists
exports.vendor = [
  'vue', 'vue-router', 'axios', 'qs', 'es6-promise'
]

// public path
exports.publicPath = '/static/'
