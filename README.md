# webpack-react-redux-es6-boilerplate
<<<<<<< HEAD
使用 webpack + react + redux + es6 的组件化前端项目样板。
=======
使用 webpack + react + redux + es6 的组件化前端样板项目。
>>>>>>> cd2e05abbc98a0c400281e7433a266caf33340cd

因为最近在工作中尝试了 [webpack](https://github.com/webpack/webpack)、[react](https://github.com/facebook/react)、[redux](https://github.com/reactjs/redux)、[es6](http://babeljs.io/docs/learn-es2015/) 技术栈，所以总结出了一套 [boilerplate](https://github.com/xiaoyann/webpack-react-redux-es6-boilerplate)，以便下次做项目时可以快速开始，并进行持续优化。

> 对应的文章： [使用 webpack + react + redux + es6 开发组件化前端项目](https://52dachu.com/post/201606271753.html)

<<<<<<< HEAD
=======
每个模块相关的 css、img、js 文件都放在一起，比较直观，删除模块时也会方便许多。测试文件也同样放在一起，哪些模块有没有写测试，哪些测试应该一起随模块删除，一目了然。

```shell
build
|-- webpack.config.js
|-- webpack.dev.js
|-- webpack.release.js
docs                                # 项目文档
node_modules                        
src                                 # 项目源码
|-- conf                            # 配置文件
|-- pages                           # 页面目录
|   |-- page1                       
|   |   |-- index.js                # 页面逻辑
|   |   |-- index.scss              # 页面样式
|   |   |-- img                     # 页面图片
|   |   |   |-- xx.png          
|   |   |-- __tests__               # 测试文件
|   |   |   |-- xx.js
|   |-- app.html                    # 入口页
|   |-- app.js                      # 入口JS
|-- components                      # 组件目录
|   |-- loading
|   |   |-- index.js
|   |   |-- index.scss
|   |   |-- __tests__               
|   |   |   |-- xx.js
|-- js
|   |-- actions
|   |   |-- index.js
|   |   |-- __tests__               
|   |   |   |-- xx.js
|   |-- reducers 
|   |   |-- index.js
|   |   |-- __tests__               
|   |   |   |-- xx.js
|   |-- xx.js               
|-- css                             # 公共CSS目录
|   |-- common.scss
|-- img                             # 公共图片目录
|   |-- xx.png
tests                               # 其他测试文件
package.json                        
READNE.md                           
```

## 要完成的功能

1. 编译 jsx、es6、scss 等资源
2. 打包合并 js、css
3. 压缩 js、css、html、png 图片
4. CssSprite 图片合并
5. 对文件使用 hash 命名，做强缓存
6. 全局替换指定字符串
7. 可灵活设置静态资源域名
8. 语法检查
9. 按指定模块化规范自动包装模块
10. 自动引入依赖资源到相应 html 页面
11. 实时编译和刷新浏览器
12. 本地接口模拟服务
13. 自动给 css 添加浏览器内核前缀
14. 发布到远端机或本机指定目录

针对以上的几点功能，接下来将一步一步的来完成这个 [boilerplate](https://github.com/xiaoyann/webpack-react-redux-es6-boilerplate) 项目， 并记录下每一步的具体操作。


> 准备工作

1、根据前面的项目结构规划创建项目骨架

```shell
$ make dir webpack-react-redux-es6-boilerplate
$ cd webpack-react-redux-es6-boilerplate
$ mkdir build docs src mock tests
$ touch build/webpack.config.js build/webpack.dev.js build/webpack.release.js
// 创建 package.json
$ npm init
$ ...
```

2、安装最基本的几个 npm 包

```shell
// webpack webpack-dev-server
// react react-dom react-router
// redux react-redux redux-thunk
$ npm i webpack webpack-dev-server --save-dev
$ npm i react react-dom react-router redux react-redux redux-thunk --save
```

3、编写示例代码，最终代码直接查看 [boilerplate](https://github.com/xiaoyann/webpack-react-redux-es6-boilerplate)


> 1、对文件使用 hash 命名，做强缓存


```js
// 指定产出文件名时加上 `[hash]` 
module.exports = {
    output: {
        filename: "[name].[hash].js"
    }
}
```

> 2、 打包合并 js、css

webpack 默认是将所有相关文件合并打包成一个文件，并提供了 [Code Splitting](http://webpack.github.io/docs/code-splitting.html) 功能便于我们按需拆分成多个文件。

> 3、 压缩 js、css、html、png 图片

> 4、CssSprite 图片合并

> 5、编译 scss、es6、jsx 等资源

> 6、全局替换指定字符串

> 7、可灵活设置静态资源域名

> 8、语法检查

> 9、按指定模块化规范自动包装模块

> 10、 自动引入依赖资源到相应 html 页面

> 11、实时编译和刷新浏览器

使用 webpack 提供的 [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) ，需要另外安装。它支持 iframe, inline 两种模式，这里将使用 inline 模式。它也同时支持 CLI、Node.js 的方式

```shell
$ npm install webpack-dev-server --save-dev
```

```js
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

var port = 8080;
var host = 'localhost';

new WebpackDevServer(webpack(webpackConfig), {
    hot: false,
    inline: true
}, (port, host, function() {
   console.log('http://' + host + ':' + port); 
});
```


> 12、本地接口模拟服务

```shell
// 直接使用 epxress 创建一个本地服务
$ npm install epxress --save-dev
$ mkdir mock && cd mock
$ touch app.js
```

```js
var express = require('express');
var app = express();

// 设置跨域访问，方便开发
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// 具体接口设置
app.get('/api/test', function(req, res) {
    res.send({ code: 200, data: 'your data' });
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mock server listening at http://%s:%s', host, port);
});
```

```shell
// 启动服务，如果用 PM2 管理会更方便，增加接口不用自己手动重启服务
$ node app.js &
```

> 13、使用 [postcss-loader](https://github.com/postcss/postcss-loader) 给 CSS 添加浏览器内核前缀

```shell
npm install postcss-loader --save-dev
npm install precss --save-dev
npm install autoprefixer --save-dev
```

```js
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return [precss, autoprefixer];
    }
}
```
 
> 14、发布到远端机或本机指定目录

```
```
>>>>>>> cd2e05abbc98a0c400281e7433a266caf33340cd
