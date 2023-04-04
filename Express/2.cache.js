const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime')

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  const filePath = path.join(__dirname, 'public', pathname);

  res.setHeader('Cache-Control', 'no-cache');
  // 强制缓存不会发起请求，所以没哟服务器返回状态码

  // no-cache表示会访问服务器有没有更新，但是浏览器中有缓存
  // 带一次访问服务器，服务器会把文件修改时间返回给你
  // 下次你再访问的时候，浏览器会携带上次设置的时候，去服务器和当前文件的修改时间做对比，
  // 入股不一样，就直接返回最新内容，如果事件一致，则返回304状态码，浏览器会去缓存中查找
  // 强制缓存和协商缓存可以配合使用：例如10s内不在访问服务器，过了10s后，会进行对比，
  // 并且在10s别来找我，不停的循环

  // 最后修改时间，可能修改时间变化了，但是内容没有变，使用文件指纹ETag
  console.log(req.url)
  fs.stat(filePath, (err, statObj) => {
    if (err) {
      res.statusCode = 404;
      res.end('NOT FOUND');
    } else {
      if (statObj.isFile()) {
        // const ctime = statObj.ctime.toGMTString();
        // console.log(req.headers['if-modified-since'] === ctime)
        // if (req.headers['if-modified-since'] === ctime) {
        //   res.statusCode = 304; //去浏览器缓存中找
        //   res.end(); // 表示服务
        // } else {
        //   res.setHeader('Last-Modified', ctime);
        //   res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
        //   fs.createReadStream(filePath).pipe(res);
        // }

        res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
        fs.createReadStream(filePath).pipe(res);

      } else {
        let htmlPath = path.join(filePath, 'index.html');
        fs.access(htmlPath, function (err) {
          if (err) {
            res.statusCode = 404;
            res.end('NOT FOUND');
          } else {
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            fs.createReadStream(htmlPath).pipe(res);
          }
        })
      }
    }
  })
})

server.listen(3000, () => {
  console.log('server listen 3000')
})