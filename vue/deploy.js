module.exports = {
  // sever account, address, port
  server: '',
  // deploy all files in the directory
  workspace: __dirname + '/dist',
  // ignore the matched files (glob pattern: https://github.com/isaacs/node-glob#glob-primer)
  // support array of glob pattern
  ignore: '**/*.map',
  // where the files are placed on the server
  deployTo: '',
  // you can specify different place for each file
  rules: [
  ]
}
