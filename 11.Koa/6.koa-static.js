const Koa = new require('koa');
const path = require('path');
// const bodyParser = require('./middleware/body-parse.js'); // koa-bodyparser
const bodyParser = require('koa-bodyparser'); // 第三方包
// const static = require('./middleware/koa-static');
const static = require('koa-static');// 第三方包

const app = new Koa();

app.use(bodyParser());// 中间件函数，必须要返回一个函数，为了方便传递参数

// 指定多个静态服务路径
app.use(static(path.resolve(__dirname, 'public')));
app.use(static(path.resolve(__dirname, 'koa')));

app.use(async (ctx, next) => {
  // 如何解析请求体
  if (ctx.method === 'POST' && ctx.path === '/form') {
    ctx.set('Content-Type', 'text/html;charset=utf-8');
    ctx.body = ctx.request.body;
  }
})

app.listen(3000, function () {
  console.log('server start 3000')
})