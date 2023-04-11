// 路径参数处理

const express = require('./express'); // 发布订阅
const app = express();

app.param('id', function (req, res, next, value, key) { // value为id的值， key就是id
  req.params.id = value + 10;
  next()
})

app.param('id', function (req, res, next, value, key) { // value为id的值， key就是id
  req.params.id = value - 5;
  next()
})

app.param('name', function (req, res, next, value, key) {
  req.params.name = value + 'px';
  next()
})

app.get('/zf/:id/:name', function (req, res, next) {
  res.end(JSON.stringify(req.params))
})

app.get('/', function (req, res) {
  res.end('ok')
})

app.listen(3000)