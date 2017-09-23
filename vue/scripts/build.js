const webpack = require('webpack')
const config = require('./config/prod')

webpack(config, function(err, stats) {
	if (err) throw err
  console.log(stats.toString({
  	colors: true,
  	chunks: false,
    modules: false
  }))
})
