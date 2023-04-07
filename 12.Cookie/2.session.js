let http = require('http');
let querystring = require('querystring');
let uuid = require('uuid');// 第三方模块

let session = {};// 用来存储客户端和服务端的数据
const CARD_ID = 'connect.sid'; // 当前是哪家店铺

http.createServer((req, res) => {
  // 当客户端访问服务端时，需要获取当前用户是否来过
  if (req.url === '/favicon.ico') return res.end(); // 屏蔽
  // cookie是以"; "分隔
  let cookies = querystring.parse(req.headers.cookie, '; ') || {}
  let cardNumber = cookies[CARD_ID];// 取到对应的卡号

  if (cardNumber && session[cardNumber]) {
    session[cardNumber].mny -= 10;
  } else {
    // 创建卡号
    cardNumber = uuid.v4(); // 申请卡号
    session[cardNumber] = { mny: 100 };// 存钱
    res.setHeader(`Set-Cookie`, `${CARD_ID}=${cardNumber}`);
  }
  res.setHeader('Content-Type', 'text/html;charset=utf8');
  res.end(`当前您的账户上有：${session[cardNumber].mny}`)

}).listen(3000)