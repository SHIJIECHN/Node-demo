// 用户默认发送get请求 /form就返回一个表单功能
// 用户可能会提交数据post请求 /form, 我们需要将数据在服务副段解析好后返回

const Koa = new require('koa');
// const bodyParser = require('./middleware/body-parse.js'); // koa-bodyparser
const bodyParser = require('koa-bodyparser')

const app = new Koa();

app.use(bodyParser());// 中间件函数，必须要返回一个函数，为了方便传递参数

app.use(async (ctx, next) => {
  if (ctx.method === 'GET' && ctx.path === '/form') {
    ctx.body = `
    <form action="/form" method="POST">
      <input type="text" name="username">
      <input type="text" name="password">
      <button>提交</button>
    </form>
    `
  } else {
    await next();
  }
})

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