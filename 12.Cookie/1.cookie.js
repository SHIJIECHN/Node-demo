let http = require('http');
let querystring = require('querystring');
let secret = 'zhufeng';
const crypto = require('crypto');
http.createServer((req, res) => {
  let arr = [];
  res.setCookie = function (key, value, options = {}) {
    let itemArr = [];
    let line;
    if (options.signedCookie) { // 判断有没有signedCookie
      // 使用crypto生成签名
      const sign = crypto.createHmac('sha256', secret)
        .update(value + '') // value必须是字符串
        .digest('base64')
        .replace(/\+|\\/g, '');
      line = `${key}=${value}.${sign}`
    } else {
      line = `${key}=${value}`;
    }
    itemArr.push(line);
    if (options.maxAge) {
      itemArr.push(`max-age=${options.maxAge}`);
    }
    if (options.domain) {
      itemArr.push(`domain=${options.domain}`);
    }
    if (options.httpOnly) {
      itemArr.push(`httpOnly=${options.httpOnly}`);
    }
    arr.push(itemArr.join('; '))
    res.setHeader('Set-Cookie', arr)
  }
  res.getCookie = function (key, options = {}) {
    let cookie = querystring.parse(req.headers['cookie'], '; ') || {};
    if (options.signedCookie) {
      if (cookie[key]) {
        let [value, sign] = cookie[key].split('.');
        let newSign = crypto.createHmac('sha256', secret)
          .update(value + '') // value必须是字符串
          .digest('base64')
          .replace(/\+|\\/g, '');
        if (sign === newSign) {
          return value;
        } else {
          return ''
        }
      } else { // 没有cookie
        return ''
      }

    } else {
      return cookie[key] && cookie[key].split('.')
    }
  }

  if (req.url === '/read') {
    // let cookie = req.headers['cookie'];
    return res.end(res.getCookie('name', { signedCookie: true }) || '没有name');
  }
  if (req.url === '/write') {
    // 设置一个
    // res.setHeader('Set-Cookie', 'name=zf');
    // 设置多个
    // res.setHeader('Set-Cookie', ['name=zf', 'age=10']);

    // 参数：domain，path，max-age，expires，httpOnly
    // domain 只在某个域名下使用cookie，如a.zhufeng.cn。默认是当前域名，.zhufeng.cn一级域名 二级域名可以公用cookie
    // path 当前在某个路径下，可以读取cookie
    // res.setHeader('Set-Cookie', ['name=zf; domain=a.zhufeng.cn; path=/write', 'age=10']);
    // max-age 以秒为单位 expires 绝对事件 设置cookie的存活事件
    // httpOnly 前端不能改变后端的cookie，相对安全一些
    // res.setHeader('Set-cookie', ['name=zf; max-age=10', 'age=10; httpOnly=true'])

    res.setCookie('name', 'zf', { signedCookie: true });
    // res.setCookie('age', '10');

    return res.end('write ok')
  }
  if (req.url === '/visit') {
    let visit = res.getCookie('visit', { signedCookie: true });
    if (visit) {
      let v = ++visit;
      res.setCookie('visit', v, { signedCookie: true });
      res.end(`${v} come`);
    } else {
      res.setCookie('visit', 1, { signedCookie: true });
      res.end('first come');
    }
  }
}).listen(3000);