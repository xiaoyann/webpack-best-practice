const fs = require('fs')

// get config of api
exports.readJSON = function(file) {
  return JSON.parse(fs.readFileSync(file))
}

// rewrite config of api
exports.writeJSON = function(file, data) {
  return fs.writeFileSync(file, data)
}

// paging
exports.paging = function(datasource, page, pageSize) {
  const start = (page - 1) * pageSize
  const end = page * pageSize
  return datasource.slice(start, end)
}

// get value by key-path
exports.getValue = function(obj, path) {
  const keys = path.split('.')
  keys.forEach(k => {
    obj = obj[k]
  })
  return obj
}

// set value by key-path
exports.setValue = function(obj, path, value) {
  const keys = path.split('.')
  const last = keys.pop()
  keys.forEach(k => {
    if (obj[k] === undefined) {
      obj[k] = {}
    }
    obj = obj[k]
  })
  obj[last] = value
}
