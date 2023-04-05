const Koa = require('./koa');

// 使用koa就创造一个应用实例
const app = new Koa();

// 中间件
// ctx 当前执行的上下文，每次请求都会产生一个上下文.ctx扩展了请求和响应的方法
// next 
app.use((ctx) => {
  // 先理解成 res.end()
  // ctx中有5个比较重要的属性

  // url
  // console.log(ctx.req.url); // /
  // console.log(ctx.request.url);// /

  // path
  // console.log(ctx.req.path);// undefined
  // console.log(ctx.request.path);// /  相当于pathname，通过url.parse(req.url)后得到的

  // Koa对请求和req和res进行了一层抽象，叫request和response，
  // 在开发的时候，我们尽量避免原生的req和res的使用

  // console.log(ctx.req.url); // / 原生
  // console.log(ctx.request.req.url);// / 原生

  console.log(ctx.request.query);// /  koa 自己封装
  console.log(ctx.query);// /
})

app.listen(3000, function () {
  console.log('server start 3000');
});// 监听一个端口号，node中http的listen方法写法一样
