const http = require('http');
const url = require('url');
const fs = require('fs');
const mime = require('mime');
const path = require('path');

// 如果访问的是文件夹，就加载文件夹下的index.html

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);
  let filePath = path.join(__dirname, pathname);
  fs.stat(filePath, function (err, statObj) {
    if (err) {
      res.statusCode = 404;
      res.end('NOT FOUND');
    } else {
      if (statObj.isFile()) {
        // 文件
        res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
        fs.createReadStream(filePath).pipe(res);
      } else {
        // 目录
        let htmlPath = path.join(filePath, 'index.html');
        fs.access(htmlPath, function (err) {
          if (err) {
            res.statusCode = 404;
            res.end('NOT FOUND');
          } else {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            fs.createReadStream(htmlPath).pipe(res);
          }
        })
      }
    }
  })
})

server.listen(3000, () => {
  console.log('server start 3000')
})