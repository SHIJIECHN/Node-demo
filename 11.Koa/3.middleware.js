const Koa = require('koa');
const fs = require('fs');

const app = new Koa();

// 1 3 2 sleep 5 6 4
// 把多个函数组合成一个promise，当这个最外层的promise成功后就会采用ctx.body的结果
// 所有use中的函数 都必须添加async和wait因为你不知道后面的逻辑是否有异步
// 如果不加await可能会出现不可控的问题
// 我们可以使用await也可以使用return，因为都可以达到等待下一个配偶米色执行完毕
// next前面必须加await 这样才能保证后面的中间件可以正常执行
// 所有的异步方法都必须变成promsie,因为await可以等待promise完成
app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
  ctx.body = 'hello';// 
})
app.use(async (ctx, next) => {
  console.log(3);
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('sleep');
      resolve();
    }, 1000)
  })
  await next();
  ctx.body = 'world'
  console.log(4);
})
app.use(async (ctx, next) => {
  console.log(5);
  await next();
  console.log(6)
})


app.listen(3000, function () {
  console.log('server start 3000')
})