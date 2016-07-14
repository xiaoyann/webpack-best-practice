var Client = require('ftp');
var client = new Client();

// 待上传的文件
var __assets__ = [];
// 是否已连接
var __connected__ = false;

var __conf__ = null;

function uploadFile(startTime) {
  var file = __assets__.shift();
  // 没有文件就关闭连接
  if (!file) return client.end();
  // 开始上传
  client.put(file.source, file.remotePath, function(err) {
    // 本次上传耗时
    var timming = Date.now() - startTime;
    if (err) {
      console.log('error ', err);
      console.log('upload fail -', file.remotePath);
    } else {
      console.log('upload success -', file.remotePath, timming + 'ms');
    }
    // 每次上传之后检测下是否还有文件需要上传，如果没有就关闭连接
    if (__assets__.length === 0) {
      client.end();
    } else {
      uploadFile();
    }
  });
}

// 发起连接
function connect(conf) {
  if (!__connected__) {
    client.connect(__conf__);
  }
}

// 连接成功
client.on('ready', function() {
  __connected__ = true;
  uploadFile(Date.now());
});

// 连接已关闭
client.on('close', function() {
  __connected__ = false;
  // 连接关闭后，如果发现还有文件需要上传就重新发起连接
  if (__assets__.length > 0) connect();
});

/**
 * [deploy description]
 * @param  {Array}   assets  待 deploy 的文件
 * file.source      buffer
 * file.remotePath  path
 */
function deployWithFtp(conf, assets, callback) {
  __conf__ = conf;
  __assets__ = __assets__.concat(assets);
  connect();
}



var path = require('path');

/**
 * [DeployPlugin description]
 * @param {Array} options
 * option.reg 
 * option.to 
 */
function DeployPlugin(conf, options) {
  this.conf = conf;
  this.options = options;
}

DeployPlugin.prototype.apply = function(compiler) {
  var conf = this.conf;
  var options = this.options;
  compiler.plugin('done', function(stats) {
    var files = [];
    var assets = stats.compilation.assets;
    for (var name in assets) {
      options.map(function(cfg) {
        if (cfg.reg.test(name)) {
          files.push({
            localPath: name,
            remotePath: path.join(cfg.to, name),
            source: new Buffer(assets[name].source(), 'utf-8')
          });
        }
      });
    }
    deployWithFtp(conf, files);
  });
};


module.exports = DeployPlugin;











