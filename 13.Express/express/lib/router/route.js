const { Router } = require("express");
const Layer = require('./layer');
const methods = require('methods');

// 每次存储时一个对象，每个layer都有一个route属性
function Route() {
  this.stack = [];
  // 用户匹配路径的时候加速匹配，如果没有此方法的处理，直接跳过即可
  this.methods = {}; // 当前route中有哪些方法，{get: true, post: true}
}

Route.prototype.dispatch = function (req, res, out) {
  let idx = 0;
  let method = req.method.toLowerCase();// 获取请求的方法
  let dispatch = (err) => {
    if (err) return out(err);
    if (idx === this.stack.length) return out();
    let layer = this.stack[idx++];
    // 获取内部的第一层，看下是否方法匹配
    if (layer.method === method) {
      layer.handler(req, res, dispatch);
    } else {
      dispatch();
    }
  }
  dispatch();
}

methods.forEach(method => {
  Route.prototype[method] = function (handles) {
    handles.forEach(handler => {
      let layer = new Layer('/', handler);
      layer.method = method;
      this.methods[method] = true; // 用户绑定了method方法，就记录一下
      this.stack.push(layer);
    })
  }
})

module.exports = Route;