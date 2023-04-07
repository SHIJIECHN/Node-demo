// koa express next

const express = require('./express');
const app = express();


app.get('/a', function (req, res, next) {
  // 包含异步逻辑
  console.log(1);
  next();
}, function (req, res, next) {
  // 包含异步逻辑
  console.log(11);
  next();
}, function (req, res, next) {
  // 包含异步逻辑
  console.log(111);
  next();
}, function (req, res, next) {
  // 包含异步逻辑
  console.log(1111);
  next();
})

app.post('/a', function (req, res, next) {
  // 包含异步逻辑
  console.log('post');
  res.end('post ok')
})

app.get('/a', function (req, res, next) {
  // 包含异步逻辑
  console.log('get');
  res.end('ok')
})

app.listen(3000, function () {
  console.log('server start 3000')
})