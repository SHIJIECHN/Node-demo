class Layer {
  constructor(method, pathname, callback) {
    this.method = method;
    this.pathname = pathname;
    this.callback = callback;
  }

  // 匹配当前请求的路径和方法，如果匹配返回true
  match(requestPath, requestMethod) {
    return this.pathname === requestPath && this.method === requestMethod
  }
}

class Router {
  constructor() {
    this.stack = [];// 存放路由设置函数
  }

  get(pathname, callback) {
    // 调用get就是来维护映射关系的
    let layer = new Layer('GET', pathname, callback); //订阅一个路由
    this.stack.push(layer); // 放入stack中
  }

  compose(matchLayers, ctx, next) {
    let dispatch = (index) => {
      // 如果走到最后，就从路由中间件出去，或者一个没有匹配到也出去
      if (index === matchLayers.length) return next()
      return Promise.resolve(matchLayers[index].callback(ctx, () => dispatch(index + 1)));
    }
    return dispatch(0);
  }

  routes() {
    return async (ctx, next) => {
      // 请求到来时会调用此方法
      let requestPath = ctx.path; // 当有请求时，拿到请求的路径
      let requestMethod = ctx.method; // 拿到请求的方法

      // 去栈中筛选出这个路径和方法下的。matchLayers为这个路径下的回调函数
      let matchLayers = this.stack.filter(layer => layer.match(requestPath, requestMethod))
      // 组合
      this.compose(matchLayers, ctx, next);
    }
  }
}

module.exports = Router;