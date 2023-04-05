const http = require('http');
const url = require('url');
const fs = require('fs');
const mime = require('mime');
const path = require('path');

// 如果访问的是文件夹，就加载文件夹下的index.html

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);
  // 客户端发送一个请求，接收客户端的数据
  // 后端路由 restful风格，一般根据请求路径和方法来处理

  if (req.headers.origin) { // 当请求头中有origin字段
    // 一般情况下都不会写 * ，因为跨域不允许携带cookie，但是我们可以强制设置携带cookie，
    // 但是设置了允许携带cookie，这个值就不能填 *
    // res.setHeader('Access-Control-Allow-Origin', '*'); 
    // 设置允许跨域
    // 表示谁来访问服务器都可以  
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin); // 允许的源
    // 服务器告诉客户端 我能识别的你自定的header
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token'); // 允许自定义的请求头
    // 告诉浏览器每隔10秒再发预检请求
    res.setHeader('Access-Control-Max-Age', '10'); // 没有设置的话浏览器每次都会发预检请求
    // 服务器可以接受哪些方法请求
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS');
    // 表示运行携带cookie了
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') { // 预检请求
      return res.end(); // 表示一个试探性请求，不用理会
    }
  }
  // 

  if (pathname === '/login' && req.method === 'POST') {
    const buffer = [];
    req.on('data', function (chunk) {
      buffer.push(chunk);
    })
    req.on('end', function () {
      res.setHeader('set-cookie', 'a=1');
      let buf = Buffer.concat(buffer); // 前端传递的数据
      console.log(req.headers['content-type'])

      // http1.0中的特点，为了能识别不同的类型，需要经过请求头来处理
      // 客户端要求返回application/json;charset=utf-8 
      if (req.headers['content-type'].includes('application/json')) {
        let obj = JSON.parse(buf.toString()); // 回显 json
        res.setHeader('Content-Type', 'application/json');// 尽量不要用浏览器猜，而是明写
        res.end(JSON.stringify(obj)); // 返回JSON类型
      } else if (req.headers['content-type'] === 'text/plain') {
        res.setHeader('Content-Type', 'text/plain')
        res.end(buf.toString()); // 返回文本类型
      } else {
        res.end('ok')
      }
    })
  } else {
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
  }


})

server.listen(3000, () => {
  console.log('server start 3000')
})