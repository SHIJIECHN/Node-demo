// http是node内置模块，可以直接使用

const http = require('http');
const url = require('url');
// request(获取请求的信息) -> response(给浏览器写数据)
// 流：http 内部是基于net模块，socket双向通信）http1.1是半双工
// 内部基于socket将其分割出request response 底层实现还是要基于socket

// 底层基于发布订阅
// 底层用socket来通信，http会增加一些header信息，请求来了之后需要在socket中读取数据，并解析成请求头
// 学http就是学header，还有解析请求，响应数据

// url由多部分组成：
// http://username:password@www.zufeng.com:80/a?a=1#aaa
// console.log(url.parse(`http://username:password@www.zufeng.com:80/a?a=1#aaa`))
/**
Url {
  protocol: 'http:',
  slashes: true,
  search: '?a=1',
  query: 'a=1',
  pathname: '/a',
  path: '/a?a=1',
  href: 'http://username:password@www.zufeng.com:80/a?a=1#aaa'
}
 */
// 如果希望query是个对象
// console.log(url.parse(`http://username:password@www.zufeng.com:80/a?a=1#aaa`, true))
/**
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'username:password',
  host: 'www.zufeng.com:80',
  port: '80',
  hostname: 'www.zufeng.com',
  hash: '#aaa',
  search: '?a=1',
  query: [Object: null prototype] { a: '1' },
  pathname: '/a',
  path: '/a?a=1',
  href: 'http://username:password@www.zufeng.com:80/a?a=1#aaa'
}
 */


const server = http.createServer((req, res) => {
  // 先获取请求行 请求方法 请求路径 版本号
  console.log('请求行---------start----------')
  console.log(req.method);// 请求方法是大写的
  console.log(req.url);// 请求路径是从路径开始，到hash的前面，默认没写路径就是 /，代表的是服务端根路径
  const { pathname, query } = url.parse(req.url, true); // 把查询路径与参数分开
  console.log(pathname, query);
  console.log('请求行---------end----------')
  console.log('请求体---------start----------')
  console.log(req.headers);// 获取浏览器的请求头，node中所有的请求头都是小写的
  console.log('请求体---------end----------')

  // post情趣和put请求有请求体，req是可读流。模拟curl --data "a=1" -v http://localhost:3000
  // 大文件上传需要分片，或者客户端上传
  let chunk = [];
  console.log('读取请求体---------start----------')
  req.on('data', function (data) { // 可读流读取的数据都是buffer类型
    chunk.push(data); // 因为服务福安接收到的数据可能是分段传输的，我们需要自己将传输的数据拼接起来
    // console.log(data); 
  })
  req.on('end', function () {// 将浏览器发送的数据全部读取完毕
    console.log(Buffer.concat(chunk).toString());
    console.log('读取请求体---------end----------')
  })

  // 响应状态码，可以自己设定一般情况不设定
  res.statusCode = 333; // 更改浏览器的响应状态
  res.statusMessage = 'my define';

  res.setHeader('MyHeader', 1);// 设置响应头

  res.write('hello'); // 响应体，如果是路径，那就把响应内容返回给页面，如果是ajax中的响应体。
  res.end('ok'); //断开，写完了

})
// server.on('request', function () { // 监听成功后的回调
//   console.log('client come on')
// })

server.listen(3000, function () {
  console.log('server start 3000')
});
// 每次更新代码需要重新启动才能运行最新代码
// nodemon（开发使用）、 pm2（线上使用）
// npm isstall nodemon -g