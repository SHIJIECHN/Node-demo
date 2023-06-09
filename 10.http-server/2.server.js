// const http = require('http');
// const url = require('url');
// const fs = require('fs');
// const mime = require('mime');
// const path = require('path');
// const querystring = require('querystring');// 查询字符串
// const uuid = require('uuid'); // 第三方模块

// // 如果访问的是文件夹，就加载文件夹下的index.html

// Buffer.prototype.split = function (sep) { // sep 分隔符
//   let len = Buffer.from(sep).length; // 强制将字符串转化成buffer。len为分隔符的长度
//   let offset = 0;
//   let current;
//   let arr = [];
//   while (-1 !== (current = this.indexOf(sep, offset))) {
//     arr.push(this.slice(offset, current));
//     offset = current + len;
//   }
//   arr.push(this.slice(offset)); // 上面没有将最后的 -- 不能放到arr中，所以需要在这里push进去
//   return arr;
// }

// const uploadPath = path.resolve(__dirname, 'upload');

// const server = http.createServer((req, res) => {
//   const { pathname, query } = url.parse(req.url);
//   // 客户端发送一个请求，接收客户端的数据
//   // 后端路由 restful风格，一般根据请求路径和方法来处理

//   if (req.headers.origin) { // 当请求头中有origin字段
//     // 一般情况下都不会写 * ，因为跨域不允许携带cookie，但是我们可以强制设置携带cookie，
//     // 但是设置了允许携带cookie，这个值就不能填 *
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     // 设置允许跨域
//     // 表示谁来访问服务器都可以
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin); // 允许的源
//     // 服务器告诉客户端 我能识别的你自定的header
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token'); // 允许自定义的请求头
//     // 告诉浏览器每隔10秒再发预检请求
//     res.setHeader('Access-Control-Max-Age', '10'); // 没有设置的话浏览器每次都会发预检请求
//     // 服务器可以接受哪些方法请求
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS');
//     // 表示运行携带cookie了
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     if (req.method === 'OPTIONS') { // 预检请求
//       return res.end(); // 表示一个试探性请求，不用理会
//     }
//   }

//   if (pathname === '/login' && req.method === 'POST') {
//     const buffer = [];
//     req.on('data', function (chunk) {
//       buffer.push(chunk);
//     })
//     req.on('end', function () {
//       res.setHeader('set-cookie', 'a=1');
//       let buf = Buffer.concat(buffer); // 前端传递的数据
//       // http1.0中的特点，为了能识别不同的类型，需要经过请求头来处理
//       // 客户端要求返回application/json;charset=utf-8
//       if (req.headers['content-type'].includes('application/json')) {
//         let obj = JSON.parse(buf.toString()); // 回显 json
//         res.setHeader('Content-Type', 'application/json');// 尽量不要用浏览器猜，而是明写
//         res.end(JSON.stringify(obj)); // 返回JSON类型
//       } else if (req.headers['content-type'] === 'text/plain') {
//         res.setHeader('Content-Type', 'text/plain')
//         res.end(buf.toString()); // 返回文本类型
//       } else if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
//         // buf.tostring()是字符串username=123&password=456，希望数据变成对象：{username: '123'}
//         let r = querystring.parse(buf.toString(), '&', '='); // 以&分隔，=连接
//         res.end(JSON.stringify(r));
//       } else if (req.headers['content-type'].includes('multipart/form-data')) { // 表单二进制格式
//         // Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryujpdWLTMwGBMBZQl
//         let boundary = req.headers['content-type'].split('=')[1];
//         boundary = '--' + boundary;
//         // buf没有split方法，手写以boundary为分隔符分隔buf字段
//         const lines = buf.split(boundary).slice(1, -1); // 去掉 前面空格 和 后面的--
//         const r = {};
//         lines.forEach(line => {
//           // 把header 和 内容进行拆分
//           let [head, body] = line.split(`\r\n\r\n`);// 两个换行，把头和内容分开。body也有可能有空行
//           head = head.toString(); // Content-Disposition: form-data; name="username
//           // console.log(body.toString()); // abc 输入框输入的内容和文件里面的内容
//           let name = head.match(/name="(.+?)"/)[1]; // ['name="username"', 'username', index:34,...]
//           if (head.includes('filename')) {
//             // 文件上传。将文件内容上传到服务器的上传文件夹中
//             // 找到buffer。4是头部到body内容的两个换行，-2就是尾部的换行
//             let buffer = line.slice(head.length + 4, -2);
//             let filename = uuid.v4();// 文件名是随机的
//             // 你最终创建完名字之后 还会同步到数据库里 ，下次查找数据库，再找到对应的文件名
//             fs.writeFileSync(path.join(uploadPath, filename), buffer)
//             r[name] = {
//               filename,
//               size: buffer.length
//               // 文件大小 fs.stat
//             }
//             // 文件名一般都是随机的
//           } else { // key:value
//             // 直接把信息放到一个对象中即可
//             r[name] = body.toString().slice(0, -2); // body内容后面还有换行 \r\n 两个字符
//           }
//         })
//         console.log(JSON.stringify(r))
//         res.end(JSON.stringify(r));
//         // {
//         //   "username": "11",
//         //   "avatar": {
//         //     "filename": "4928ab49-8238-40fb-ae10-d8b6f8b0f65e",
//         //     "size": 3
//         //   }
//         // }
//       }
//     })
//   } else {
//     let filePath = path.join(__dirname, pathname);
//     fs.stat(filePath, function (err, statObj) {
//       if (err) {
//         res.statusCode = 404;
//         res.end('NOT FOUND');
//       } else {
//         if (statObj.isFile()) {
//           // 文件
//           res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
//           fs.createReadStream(filePath).pipe(res);
//         } else {
//           // 目录
//           let htmlPath = path.join(filePath, 'index.html');
//           fs.access(htmlPath, function (err) {
//             if (err) {
//               res.statusCode = 404;
//               res.end('NOT FOUND');
//             } else {
//               res.setHeader('Content-Type', 'text/html; charset=utf-8');
//               fs.createReadStream(htmlPath).pipe(res);
//             }
//           })
//         }
//       }
//     })
//   }
// })

// server.listen(3000, () => {
//   console.log('server start 3000')
// })

//===========================================
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const querystring = require('querystring'); // json.parse  json.stringify

const uuid = require('uuid'); // 第三方模块
Buffer.prototype.split = function (sep) {
  let len = Buffer.from(sep).length; // 强制将字符串转化成buffer
  let offset = 0;
  let current;

  let arr = [];
  while (-1 !== (current = this.indexOf(sep, offset))) {
    arr.push(this.slice(offset, current))
    offset = current + len
  }
  arr.push(this.slice(offset));

  return arr;

}

const uploadPath = path.resolve(__dirname, 'upload');

const server = http.createServer((req, res) => {
  let { pathname, query } = url.parse(req.url, true);

  // 客户端会发送一个请求， 接受客户端的数据 

  // 后端“路由”  restful风格  一般根据请求路径和方法 来做处理

  // cors
  // if (req.headers.origin) {
  //     // 表示谁来访问服务器都可以 (token 不是cookie，cookie跨域不能使用 *)
  //     res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

  //     // 服务器告诉浏览器 我能识别你自定的header
  //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token')

  //     // 每隔10s试探一次
  //     res.setHeader('Access-Control-Max-Age', '10');
  //     // 我服务可以接受哪些方法的请求
  //     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST,OPTIONS')

  //     // 表示运行携带cookie了
  //     res.setHeader('Access-Control-Allow-Credentials', true)

  //     if (req.method === 'OPTIONS') {
  //         return res.end(); // 表示是一个试探型请求 不要处理就ok
  //     }
  // }



  if (pathname === '/login' && req.method == 'POST') {
    const buffer = [];
    req.on('data', function (chunk) {
      buffer.push(chunk);
    });
    req.on('end', function () {
      let buf = Buffer.concat(buffer); // 前端传递的数据 
      // http1.0中的特点 为了能识别不同类型 需要通过请求头来处理
      if (req.headers['content-type'] === 'application/json') {
        let obj = JSON.parse(buf.toString()); // 回显json
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(obj));
      } else if (req.headers['content-type'] === 'text/plain') {
        res.setHeader('Content-Type', 'text/plain')
        res.end(buf.toString());
      } else if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        // {username:"123"}  username=123&password=456  a=1; b=2
        let r = querystring.parse(buf.toString(), '&', '='); // 可以将查询字符串 转化成对象
        res.end(JSON.stringify(r));
      } else if (req.headers['content-type'].includes('multipart/form-data')) {
        let boundary = "--" + req.headers['content-type'].split('=')[1];
        let lines = buf.split(boundary).slice(1, -1);
        const r = {};
        lines.forEach(line => {
          // 把header 和 内容进行拆分
          let [head, body] = line.split(`\r\n\r\n`);
          head = head.toString();
          let name = head.match(/name="(.+?)"/)[1];
          if (head.includes('filename')) {
            // 文件上传  将文件内容上传到服务器的上传文件夹中
            let buffer = line.slice(head.length + 4, -2);
            let filename = uuid.v4();
            // 你最终创建完名字之后 还会同步到数据库里 ，下次查找数据库，再找到对应的文件名
            fs.writeFileSync(path.join(uploadPath, filename), buffer)
            r[name] = {
              filename,
              size: buffer.length
              // 文件大小 fs.stat
            }
            // 文件名一般都是随机的
          } else { // key:value
            // 直接把信息放到一个对象中即可
            r[name] = body.toString().slice(0, -2);
          }
        })
        res.end(JSON.stringify(r));
      }
    })
  } else {
    let filePath = path.join(__dirname, pathname);
    fs.stat(filePath, function (err, statObj) {
      if (err) {
        res.statusCode = 404;
        res.end('NOT FOUND')
      } else {
        if (statObj.isFile()) {
          res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8')
          fs.createReadStream(filePath).pipe(res);
        } else {
          let htmlPath = path.join(filePath, 'index.html');
          fs.access(htmlPath, function (err) {
            if (err) {
              res.statusCode = 404;
              res.end('NOT FOUND')
            } else {
              res.setHeader('Content-Type', 'text/html;charset=utf-8')
              fs.createReadStream(htmlPath).pipe(res);
            }
          })
        }
      }
    })
  }





});

server.listen(3000, () => {
  console.log(`server start 3000`)
})