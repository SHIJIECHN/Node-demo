const url = require('url');
const Layer = require('./layer.js');
const Route = require('./route.js');
const methods = require('methods'); // 数组，放了所有的请求方法
const e = require('express');

function Router() { // express.Router返回的结果会放到use上 app.use()
  let router = (req, res, next) => {
    // 当二级路由匹配到后会执行此方法，需要去当前stack中依次取出来执行，如果处理不了调用next会继续找下一个
    router.handle(req, res, next);
  }
  router.stack = [];
  router.__proto__ = proto;
  router.paramsCallback = {}; // {key:[fn, fn]}
  return router; // 通过原型链来查找
}
let proto = {};
proto.param = function (key, handler) {
  if (this.paramsCallback[key]) {
    this.paramsCallback[key].push(handler);
  } else {
    this.paramsCallback[key] = [handler];
  }
}

proto.route = function (path) {
  let route = new Route();
  let layer = new Layer(path, route.dispatch.bind(route)); // 给当前调用get方法，放入一层
  layer.route = route; // 每个层都有一个route属性，表示它是一个路由
  this.stack.push(layer);
  return route;
}

proto.use = function (path, handler) {
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
  proto[method] = function (path, handlers) { // 用户调用get方法时 传递了多个处理函数
    let route = this.route(path); // 构建一个route
    route[method](handlers); // 交给route来存储用户真正的handler
  }
})

proto.process_params = function (layer, req, res, done) {
  // 当没有匹配出key的时候
  if (!layer.keys || layer.keys.length === 0) {
    done();
  }
  // 获取所有的key [id, name]
  let keys = layer.keys.map(item => item.name); // [id, name]
  // params=> {id:[fn, fn], name:[fn]}
  let params = this.paramsCallback;
  let idx = 0;
  function next() {
    if (keys.length === idx) return done();
    let key = keys[idx++]; // id
    processCallback(key, next);
  }
  next();

  function processCallback(key, out) { // key: id
    let fns = params[key]; // [fn, fn]
    if (!fns) {
      return out();
    }
    let idx = 0;
    let value = req.params[key]; // 用的是老值
    function next() { // 依次执行fn对应的回调
      if (idx === fns.length) return out();
      let fn = fns[idx++];
      fn(req, res, next, value, key);
    }
    next();
  }
}

proto.handle = function (req, res, out) {
  // 请求到来时，开始处理请求
  let { pathname } = url.parse(req.url);// 获取请求的路径
  let idx = 0;
  let removed = '';
  let dispatch = (err) => { // express 需要通过dispatch函数来迭代
    if (idx === this.stack.length) return out(); // 如果路由处理不了交给application处理
    if (removed) {
      req.url = removed + req.url; // /user + /add 把刚才删除的/user 再加回来
      removed = ''; // 每次增加厚移除掉removed
    }
    let layer = this.stack[idx++];
    if (err) { // 用户传入了错误属性
      // 如果有错误，我需要往下一直查找，错误处理中间件
      if (!layer.route) { // 中间件：有两种可能，一种普通中间件，一种错误中间件
        // 中间件的回调处理函数参数 必须要有四个
        layer.handle_error(err, req, res, dispatch);
      } else {
        dispatch(err); // 是路由直接忽略
      }
    } else {
      // if (layer.match(pathname) && layer.route.methods[req.method.toLowerCase()]) { // 区分职责，谁来做对应的事，路由系统之复杂存储层和调用层
      //   // 匹配到了路由。层自己处理请求，调用route的dispatch方法
      //   layer.handle_request(req, res, dispatch); // layer.handler存放的是route.dispatch.bind(route);
      // } else {
      //   dispatch();
      // }
      // 路由或者中间件要求路径都必须匹配才行
      if (layer.match(pathname)) { // layer有可能为中间件，还有可能是路由
        // 如果是中间件，不需要匹配方法
        // 正常时不执行错误中间件
        if (!layer.route && layer.handler.length !== 4) { // 是中间件，直接执行对应的方法即可，不同匹配方法

          // 在这里把二级路由的路径user删除掉./user/add -> 删除掉/user
          if (layer.path !== '/') {// 如果路由不是 / 就需要删除前缀
            removed = layer.path; // /user
            req.url = req.url.slice(layer.path.length)
          }

          layer.handle_request(req, res, dispatch);
        } else {
          // 如果是路由，需要匹配方法
          if (layer.route.methods[req.method.toLowerCase()]) {
            req.params = layer.params;
            // 执行订阅好的事件
            this.process_params(layer, req, res, () => {
              layer.handle_request(req, res, dispatch);
            });
          } else {
            dispatch();
          }
        }
      } else {
        dispatch();
      }
    }
  }
  dispatch();
}

module.exports = Router;