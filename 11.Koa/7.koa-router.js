const Koa = new require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser'); // 第三方包
const static = require('koa-static');// 第三方包
// const Router = require('./middleware/koa-router');
const Router = require('koa-router');
const router = new Router();

const app = new Koa();
app.use(bodyParser());

app.use(static(path.resolve(__dirname, 'public')));
app.use(static(path.resolve(__dirname, 'koa')));

app.use(router.routes());

router.get('/user/add', async (ctx, next) => {
  ctx.body = '/user/add';
})

router.get('/user/remove', async (ctx, next) => {
  ctx.body = '/user/remove1'
  console.log(1)
  // next(); // 路由基本上不再调用next
})

router.get('/user/remove', async (ctx, next) => {
  ctx.body = '/user/remove2';
  console.log(2)
  // next();
})

app.use(function (ctx, next) {
  ctx.body = 'end';
})

// app.use(async (ctx, next) => {
//   // 如何解析请求体
//   if (ctx.method === 'POST' && ctx.path === '/form') {
//     ctx.set('Content-Type', 'text/html;charset=utf-8');
//     ctx.body = ctx.request.body;
//   }
// })

app.listen(3000, function () {
  console.log('server start 3000')
})