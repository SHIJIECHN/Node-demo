const Koa = require('./koa');
const fs = require('fs');

const app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
  await next();
  await next();
  console.log(2);
})
app.use(async (ctx, next) => {
  console.log(3);
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('sleep');
      resolve();
    }, 1000)
  })
  next();
  console.log(4);
})
app.use(async (ctx, next) => {
  console.log(5);
  next();
  console.log(6)
})

app.on('error', (err) => {
  console.log('catch err,', err);
})


app.listen(3000, function () {
  console.log('server start 3000')
})


// 1. 支持中间件的写法use（组合）
// 2. 监听错误（对错误的监听）
// 3. 扩展了req和res中的属性和方法