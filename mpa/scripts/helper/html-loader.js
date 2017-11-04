module.exports = function(source) {
  this.cacheable && this.cacheable()
  return source.replace(/src="([^<]+)"/g, function(m, s) {
    if (/^https?:/.test(s)) {
      return m
    }
    return 'src=<%=require("'+ s +'")%>'
  })
}
