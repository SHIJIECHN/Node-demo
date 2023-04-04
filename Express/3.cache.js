const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const crypto = require('crypto');

// 只要协商缓存有一个不一样都要重新对比
// 强制缓存就是减少请求，协商缓存就是保证服务器的内容和缓存中的内容是一样的
// 第一次拿文件，去服务器上拿文件，走的是强制缓存，同时服务器告诉你，5秒内都不要来找我，去缓存里面拿，
// 从缓存中拿资源的时候就是协商缓存，当5秒时间到了，又会走强制缓存拿资源，再进行缓存。在协商缓存的过程中
// 就是比对资源的Last-Modified、ETag，任何一个发生改变都会进行强制缓存
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  const filePath = path.join(__dirname, 'public', pathname);

  res.setHeader('Cache-Control', 'no-cache'); // 不考虑强制缓存
  // 可以采用指纹的方式，但是对于大文件，我们不会直接全量对比
  // 用文件的大小生成一个指纹，文件的开头等
  // 此案例我们就采取全量比对
  fs.stat(filePath, (err, statObj) => {
    if (err) {
      res.statusCode = 404;
      res.end('NOT FOUND');
    } else {
      if (statObj.isFile()) {
        let content = fs.readFileSync(filePath);
        let etag = crypto.createHash('md5').update(content).digest('base64');
        if (req.headers['if-none-match'] === etag) {
          res.statusCode = 304;
          res.end();
        } else {
          res.setHeader('ETag', etag);
          res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
          fs.createReadStream(filePath).pipe(res);
        }
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