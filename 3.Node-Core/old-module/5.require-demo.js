// 1. require方法 -> Module.proottpe.require方法
// 2. Module._load加载模块
// 3. Module._resolveFilename 方法把路径变成了绝对路径 添加后缀名（.js .json) .node
// 4. new Module 拿到绝对路径创造一个模块 this.id exports={}
// 5. module.load 对模块进行加载
// 6. 根据文件后缀 Module._extension['js']去做策略加载
// 7. 用的是同步读取文件
// 8. 增加一个函数的壳子，并且让函数执行，让module.exports作为this
// 9. 用户会默认拿到了module.exports的返回结果

let a = require('./a.js')
console.log(a);

// // 读取到文件后相当于，包裹一个函数
// let a = (function (exports, module, require, __dirname, __filename) {
//   var a = 100; // 此时a与外面的a就隔离开来了
//   module.exports = a // a.js的内容

//   return module.exports; // 导出

// })(exports, module, require, __dirname, __filename)

