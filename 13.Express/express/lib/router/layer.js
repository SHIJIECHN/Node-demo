function Layer(path, handler) {
  this.path = path;
  this.handler = handler; // 存放的是route.dispatch.bind(route),也就是route中的dispatch方法
}

Layer.prototype.match = function (pathname) {
  if (this.path === pathname) {
    return true;
  }
  // 如果是中间件，要特殊处理。中间件的特点，开头为/，都能处理
  if (!this.route) { // 是中间件
    if (this.path === '/') {// 中间件的路径是/，说明都匹配
      return true;
    }
    return pathname.startsWith(this.path + '/'); // 中间件path：/a，pathname：/a/b。pathname是不是以/a/开头
  }

}

Layer.prototype.handle_request = function (req, res, next) {
  this.handler(req, res, next);
}
module.exports = Layer;