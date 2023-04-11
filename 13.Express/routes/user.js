const express = require('express');
const user = express.Router(); // 产生一个路由系统

user.get('/add', function (req, res, next) {
  res.end('user add')
})
user.get('/remove', function (req, res, next) {
  res.end('user remove')
})

module.exports = user;