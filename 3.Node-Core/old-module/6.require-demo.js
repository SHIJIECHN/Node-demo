// 1. require方法 -> Module.prototype.require方法
// 2. Module._load加载模块
// 3. Module._resolveFilename 方法把传入的路径变成了绝对路径并尝试添加后缀名（.js .json) .node
// 4. new Module 拿到绝对路径创造一个模块 this.id exports={}
// 5. module.load 对模块进行加载
// 6. 根据文件后缀 Module._extension['js']去做策略加载
// 7. 用的是同步读取文件
// 8. 增加一个函数的壳子，并且让函数执行，让module.exports作为this
// 9. 用户会默认拿到了module.exports的返回结果
// 最终返回的是exports对象

const fs = require('fs');
const path = require('path');
const vm = require('vm');
function Module(id) {
  this.id = id;
  this.exports = {}; // 空对象

}
Module._cache = {}
Module._extensions = {
  '.js'(module) { // js是变成一个函数，执行
    // 1. 读取文件
    let script = fs.readFileSync(module.id, 'utf8');
    // 2. 增加函数
    let templateFn = `(function(exports,module,require,__dirname,__filename){${script}})`;
    // 3. 将字符串变成函数，相当于 new Function
    let fn = vm.runInThisContext(templateFn);
    let exports = module.exports;
    let thisValue = exports; // this = module.exports = exports
    let filename = module.id;
    let dirname = path.dirname(filename);
    // 4. 函数执行。函数call的作用：1）改变this指向；2）让函数执行
    fn.call(thisValue, exports, module, require, dirname, filename);// 调用了a模块，module.exports = 100
  },
  '.json'(module) {
    // 加载模块。json是我们自己读到解析。
    let script = fs.readFileSync(module.id, 'utf8');
    module.exports = JSON.parse(script);
  }
}
// 将路径变成绝对路径，并且加后缀
Module._resloveFilename = function (id) {
  let filePath = path.resolve(__dirname, id);// \Users\小石头\Documents\Learning\A05-operationEnv\Node\Node-demo\3.Node-Core\a
  let isExists = fs.existsSync(filePath);// 是否有后缀
  if (isExists) return filePath; // 如果有后缀，就直接返回
  // 尝试添加后缀 .js 
  let keys = Reflect.ownKeys(Module._extensions); // ['.js', '.json'];
  for (let i = 0; i < keys.length; i++) {
    let newPath = filePath + keys[i];
    if (fs.existsSync(newPath)) return newPath; // 查看添加后缀后的文件存不存在，存在就把路径返回
  }
  throw new Error('module not found.')

}

Module.prototype.load = function () {
  let ext = path.extname(this.id);// 获取文件后缀名
  Module._extensions[ext](this); // 调用对应的策略，this是当前模块
}

function req(filename) {
  // 1. 创造一个绝对应用地址，方便后续读取
  filename = Module._resloveFilename(filename); // c:\Users\小石头\Documents\Learning\A05-operationEnv\Node\Node-demo\3.Node-Core\a.js

  // 查看缓存
  let cacheModule = Module._cache[filename];// 获取缓存的模块
  if (cacheModule) return cacheModule.exports; // 直接将上次缓存到的模块返回

  // 2. 根据路径创造一个模块
  const module = new Module(filename);
  Module._cache[filename] = module;// 最终：缓存模块。根据文件名绝对路径来缓存
  // 3. 对模块进行加载
  module.load(); // 就是让用户给module.exports赋值

  return module.exports; // 默认是一个空对象
}

let a = req('./a.js');
a = req('./a.js');
a = req('./a.js');
console.log(a);

