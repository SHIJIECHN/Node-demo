// 中间件
// 提供了一些扩展的属性和方法

const express = require('./express');

const app = express();

app.use(function (req, res, next) { // 优先级内部已经定好了
  let url = require('url');
  let path = require('path');
  let fs = require('fs');
  let mime = require('mime');
  let { query, path: p } = url.parse(req.url, true);
  req.query = query;
  req.path = p;
  res.send = function (value) { // 有问题。。。。
    if (Buffer.isBuffer(value) || typeof value === 'string') {
      res.end(value);
    } else if (typeof value == 'object') {
      res.end(JSON.stringify(value))
    }
  }

  res.sendFile = function (filename, { root } = {}) {
    let filePath = '';
    if (typeof root === 'undefined') {
      filePath = filename;
    } else {
      filePath = path.resolve(root, filename);
    }
    res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8')
    fs.createReadStream(filePath).pipe(res);
  }
  next();
})

express.static = function (dirname) {
  return (req, res, next) => {
    let path = require('path');
    let fs = require('fs');
    let absPath = path.join(dirname, req.path);
    fs.stat(absPath, function (err, statObj) {
      if (err) {
        return next();
      }
      if (statObj.isFile()) {
        res.sendFile(absPath)
      }
    })
    next()
  }
}

/**
koa-router        express内置
koa-views         express内置
koa-static        express内置
koa-bodyparser    body-parser
koa2-multer       multer
内置cookie        express-parser
koa-session       express-session
 */
app.use(express.static(__dirname));


// 主要内部维护了一些新的req和res的方法，返回一个文件
app.get('/', function (req, res, next) {
  console.log(req.path);
  console.log(req.query);
  // res.send({ name: 'zf' });
  res.sendFile('1.server.js', { root: __dirname })
})

app.listen(3000);