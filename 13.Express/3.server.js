// 中间件
// 1. 控制是否向下执行（权限处理）
// 2. 扩展req res中的方法
// 3. 体前处理逻辑

// 中间件一般放在路由之前

const express = require('./express');
const app = express();

app.use(function (req, res, next) {
  req.a = 1;
  next();
})
app.use('/', function (req, res, next) {
  req.a++;
  next();
})
app.use('/a', function (req, res, next) {
  req.a++;
  next();
})
app.get('/a', function (req, res, next) {
  res.end(req.a + '')
  next();
})
app.get('/', function (req, res, next) {
  res.end(req.a + '')
})

app.listen(3000, function () {
  console.log('server start 3000')
})