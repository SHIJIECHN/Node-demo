const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const mime = require('mime');

// 缓存指代的是静态文件的缓存
// 缓存：强制缓存（不会再次向服务器发起请求），对比缓存（协商缓存，需要服务器上返回文件进行对比）
// 两者最大的区别是：对比缓存需要向服务器发起请求
const server = http.createServer((req, res) => {
  let { pathname, query } = url.parse(req.url, true);
  // 如果返回的是一个html，html引用了其他资源，会向服务器发起请求
  // 强制缓存 第一次浏览器直接访问时，不走强制缓存。


  // 静态服务
  let filePath = path.join(__dirname, 'public', pathname);

  // 服务器跟客户端说，下次别找我了
  console.log(req.url)
  // 强制缓存不对首次访问的路径处理，后序的资源10s内不会再请求服务器。返回的资源状态码200，
  // 缓存类型：disk cache memory cache代码无法控制，浏览器自己控制

  // no-cache：每次都向服务器发送请求，但是资源会存到浏览器缓存里
  // no-store：每次都向服务器发送请求，不会缓存到浏览器缓存里
  // 
  res.setHeader('Cache-Control', 'max-age=10'); // 相对时间，设置缓存的时长
  res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString()); // 绝对时间
  fs.stat(filePath, function (err, statObj) {
    if (err) { // 不是一个有效路径
      res.statusCode = 404;
      res.end('NOT FOUND');
    } else {
      if (statObj.isFile()) { // 是文件
        res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8')
        fs.createReadStream(filePath).pipe(res);
      } else {
        // 如果是目录，需要找目录下的index.html，看看文件存不存在，如果存在把文件返回
        const htmlPath = path.join(filePath, 'index.html')
        // 有没有文件
        fs.access(htmlPath, function (err) {
          if (err) {
            res.statusCode = 404;
            res.end('NOT FOUND');
          } else {
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            fs.createReadStream(htmlPath).pipe(res)
          }
        })
      }
    }
  })
})


server.listen(3000, () => {
  console.log('server start 3000');
})