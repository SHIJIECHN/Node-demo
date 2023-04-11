const pathToRegExp = require('path-to-regexp');
function Layer(path, handler) {
  this.path = path;
  this.handler = handler; // 存放的是route.dispatch.bind(route),也就是route中的dispatch方法
  // 把路径转成正则
  // layer 增加了reg keys属性
  this.reg = pathToRegExp(this.path, this.keys = []);
  // console.log(this.reg, this.keys);
}

Layer.prototype.match = function (pathname) {
  let match = pathname.match(this.reg);
  if (match) {
    // 两个数组合并成对象 [xxx, 1,2]  [{name: id} {name: name}] => {id:1, name:2}
    this.params = this.keys.reduce((memo, current, index) => {
      memo[current.name] = match[index + 1];
      return memo;
    }, {})
    return true;
  }

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
  return false;
}

Layer.prototype.handle_error = function (err, req, res, next) {
  if (this.handler.length === 4) { // 如果参数的个数是四个，说明找到了错误处理中间件
    return this.handler(err, req, res, next);
  } else { // 没找到继续向下找
    next(err);
  }
}

Layer.prototype.handle_request = function (req, res, next) {
  this.handler(req, res, next);
}
module.exports = Layer;