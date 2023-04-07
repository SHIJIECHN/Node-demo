const url = require('url');
const Layer = require('./layer.js');
const Route = require('./route.js');
const methods = require('methods'); // 数组，放了所有的请求方法
const e = require('express');

function Router() {
  this.stack = [];
}
Router.prototype.route = function (path) {
  let route = new Route();
  let layer = new Layer(path, route.dispatch.bind(route)); // 给当前调用get方法，放入一层
  layer.route = route; // 每个层都有一个route属性，表示它是一个路由
  this.stack.push(layer);
  return route;
}

Router.prototype.use = function (path, handler) {
  console.log(path)
  // 中间件会放到当前的路由系统中
  if (typeof path === 'function') { // 没有传path，给path默认值
    handler = path;
    path = '/';
  }
  let layer = new Layer(path, handler);// 产生一层
  layer.route = undefined; // 如果route是undefined，说明是中间件
  this.stack.push(layer);
}

methods.forEach(method => {
  Router.prototype[method] = function (path, handlers) { // 用户调用get方法时 传递了多个处理函数
    let route = this.route(path); // 构建一个route
    route[method](handlers); // 交给route来存储用户真正的handler
  }
})


Router.prototype.handle = function (req, res, out) {
  // 请求到来时，开始处理请求
  let { pathname } = url.parse(req.url);// 获取请求的路径
  let idx = 0;
  let dispatch = () => { // express 需要通过dispatch函数来迭代
    if (idx === this.stack.length) return out(); // 如果路由处理不了交给application处理
    let layer = this.stack[idx++];
    // if (layer.match(pathname) && layer.route.methods[req.method.toLowerCase()]) { // 区分职责，谁来做对应的事，路由系统之复杂存储层和调用层
    //   // 匹配到了路由。层自己处理请求，调用route的dispatch方法
    //   layer.handle_request(req, res, dispatch); // layer.handler存放的是route.dispatch.bind(route);
    // } else {
    //   dispatch();
    // }
    // 路由或者中间件要求路径都必须匹配才行
    if (layer.match(pathname)) { // layer有可能为中间件，还有可能是路由
      // 如果是中间件，不需要匹配方法
      if (!layer.route) { // 是中间件，直接执行对应的方法即可，不同匹配方法
        layer.handle_request(req, res, dispatch);
      } else {
        // 如果是路由，需要匹配方法
        if (layer.route.methods[req.method.toLowerCase()]) {
          layer.handle_request(req, res, dispatch);
        } else {
          dispatch();
        }
      }
    } else {
      dispatch();
    }
  }
  dispatch();
}

module.exports = Router;