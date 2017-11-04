const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlPlugins = [
  {
    template: 'pages/index.html',
    filename: 'index.html'
  },
  {
    template: 'pages/about.html',
    filename: 'about.html'
  }
].map(options => {
  if (process.env.NODE_ENV === 'production') {
    // https://github.com/kangax/html-minifier#options-quick-reference
    options.minify = {
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true
    }
  }
  return new HtmlWebpackPlugin(options)
})

module.exports = function(config) {
  config.plugins = config.plugins.concat(htmlPlugins)
  return config
}
