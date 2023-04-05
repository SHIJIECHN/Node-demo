function bodyParser() {
  return async (ctx, next) => {
    // 1. 自己定义一个请求体，把promise执行后的结果赋给了ctx.request.body
    ctx.request.body = await new Promise((resolve, reject) => {
      let arr = [];
      ctx.req.on('data', function (chunk) {
        arr.push(chunk);
      })
      ctx.req.on('end', function () { // get请求没有请求体，直接触发end
        // ctx.res.setHeader('Content-Type', 'text/html;charset=utf-8')
        resolve(Buffer.concat(arr));
      })
    })
    // 2. 执行下一个
    await next();
  }
}


module.exports = bodyParser;