const express = require('express');
const article = express.Router(); // 产生一个路由系统

article.get('/addx', function (req, res, next) {
  res.end('article add')
})
article.get('/remove', function (req, res, next) {
  res.end('article remove')
})

module.exports = article;