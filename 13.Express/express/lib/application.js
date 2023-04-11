const http = require('http');
const url = require('url');
const path = require('path');
const Router = require('./router')
const methods = require('methods')

function Application() { // 路由的配置应该归属应用来管理

}

Application.prototype.lazy_route = function () {
  if (!this._router) {
    // 把应用和路由分离
    this._router = new Router();// 默认已调用express就执行，希望调用get或者post等方法的时候再创建
  }
}


Application.prototype.param = function (key, handler) {
  this.lazy_route();
  this._router.param(key, handler);
}


Application.prototype.use = function (path, handler) {
  this.lazy_route(); // 有请求的时候再创建路由
  this._router.use(path, handler);
}

methods.forEach(method => {
  Application.prototype[method] = function (path, ...handlers) { // 订阅
    this.lazy_route(); // 有请求的时候再创建路由
    this._router[method](path, handlers);
  }
})


Application.prototype.listen = function () {
  let self = this;
  let server = http.createServer(function (req, res) {
    // 应用提供一个找不到的方法，如果路由尾部匹配不到，调用此方法
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`)
    }
    self._router.handle(req, res, done);
  });
  server.listen.apply(server, arguments);
}

module.exports = Application;