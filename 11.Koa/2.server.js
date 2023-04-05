const Koa = require('./koa');
const fs = require('fs')

// 使用koa就创造一个应用实例
const app = new Koa();

// 对koa中的ctx.request ctx.response进行了扩展，增减一些内置的方法
app.use((ctx) => {
  ctx.body = 'hello'
  ctx.body = { name: 'zf' }; // 等价ctx.body = ctx.reponse.body = 'hello'
  // console.log(ctx.response.body);// 不等价与res.end()

  // 返回流
  ctx.body = fs.createReadStream('./note.md');
  // rs.pipe(ws)
})

app.listen(3000, function () {
  console.log('server start 3000');
});// 监听一个端口号，node中http的listen方法写法一样
