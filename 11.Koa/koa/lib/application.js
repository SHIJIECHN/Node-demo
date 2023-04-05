const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const Stream = require('stream');
const EventEmitter = require('events')

class Application extends EventEmitter {
  constructor() {
    super();
    // 实现每次创建new 一个应用都有自己的全新上下文 应用层的隔离
    this.context = Object.create(context); // this.context = new content()一样
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middlewares = [];  // 中间件
  }

  use(middleware) {
    // this.fn = fn; // 订阅 
    this.middlewares.push(middleware)
  }

  createRequest(req, res) {
    // 这个目的是为了每次 请求 的时候，都拥有自己的上下文，而且自己的上下文是
    // 可以获取公共上下文声明的变量、属性
    let ctx = Object.create(this.context);
    this.request = Object.create(this.request);
    this.response = Object.create(this.response);

    ctx.request = request;//  上下文中包含着request，增加request属性
    ctx.req = ctx.request.req = req; // 默认上下文包含着原生的req。增加req属性，并在request对象上增加req属性

    ctx.response = response;
    ctx.res = ctx.response.res = res;

    return ctx

  }
  // 把多个middleware组合一个大的promise
  compose(ctx) {
    // 组合是要将数组里的函数一个个执行
    let index = -1; // 控制数组的迭代
    const dispatch = (i) => { // 派发
      // f防止一个next多次调用
      if (i <= index) return Promise.reject('multiple call next()');
      // 如果没有中间件，直接resolve成功即可
      index = i;
      if (this.middlewares.length === index) return Promise.resolve();
      // 保存第一次调用next时的索引
      // 如果不是Promise就转成Promise。一个promise在执行的时候，会等待返回的的promise执行完毕
      return Promise.resolve(this.middlewares[i](ctx, () => dispatch(i + 1)));
    }
    return dispatch(0);
  }

  handleRequest = (req, res) => { // 每次
    let ctx = this.createRequest(req, res);
    res.statusCode = 404;
    // this.fn(ctx);

    // 组合返回promise
    this.compose(ctx).then(() => {
      let _body = ctx.body;
      if (_body) { // 通过判断ctx.body类型，返回值需要修改为字符串形式
        if (typeof _body === 'string' || Buffer.isBuffer(_body)) { // string buffer
          return res.end(_body)
        } else if (typeof _body === 'number') { // 如果是数字
          return res.end(_body + '');
        } else if (_body instanceof Stream) { // 如果是对象
          // // 可以设置成下载头
          // res.setHeader('Content-Type', 'application/octet-stream');
          // // 下载成附件 
          // res.setHeader('Content-Disposition', 'attachment;filename=a');
          return _body.pipe(res);
        } else if (typeof _body == 'object') { // 是不是Stream的实例，也就是流
          return res.end(JSON.stringify(_body));
        }
      } else {
        res.end('NOT FOUND');
      }
    }).catch(err => {
      this.emit('error', err); // 触发app.on('error')事件
    })
  }

  listen(...args) {
    const server = http.createServer(this.handleRequest);
    server.listen(...args)
  }
}

module.exports = Application;