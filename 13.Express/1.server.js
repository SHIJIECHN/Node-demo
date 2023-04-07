// 内部不是es6的写法，都是构造函数，异步处理、迭代都是通过回调的方式

// express是一个函数，可以调用这个函数创建一个应用
const express = require('./express');

const app = express();// 创建应用

// 没有ctx对象，主要靠的是原生的req和res，express直接在上面扩展的
app.get('/', function (req, res) {
  res.end('/')
});

app.get('/hello', function (req, res) {
  res.end('hello')
})

// 都没匹配到，就会执行
// app.all('*', function (req, res) {
//   res.end('*')
// })

app.listen(3000, function () {
  console.log('server start 3000');
})

