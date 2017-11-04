const bodyParser = require('body-parser')
const utils = require('./utils')

function handler(req, res, next) {
  // get corresponding config for current request
  try {
    var conf = utils.readJSON(__dirname + req.path + '.json')
  } catch(err) {
    return next()
  }

  const responseName = conf.responseName

  // paging
  if (conf.isPaging && conf.datasource.indexOf(responseName) === 0) {
    let datasource = utils.getValue(conf.response, conf.datasource)
    let page = req.query.page || req.body.page || 1
    utils.setValue(conf.response, conf.datasource, utils.paging(datasource, page, 2))
  }

  // get response
  const response = conf.response[responseName]

  // simulate network latency
  setTimeout(() => {
    res.send(response)
  }, conf.delay)
}

module.exports = (app) => {
  app.use(bodyParser.json())
  app.all('*', handler)
}
