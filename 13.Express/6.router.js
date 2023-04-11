// 多级路由
const express = require('./express');
const app = express();
const user = require('./routes/user');
const article = require('./routes/article');

app.use('/user', user);
app.use('/user', article);
// app.get('/add', function (req, res) {
//   res.end('hello')
// })


app.listen(3000);