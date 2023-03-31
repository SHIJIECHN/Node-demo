// const path = require('path');
// console.log(path.resolve('a', 'b', 'c'))//解析绝对路径，解析默认采用process.cwd()。如果有路径/ 会回到根目录
// // c:\Users\a\b\c
// console.log(path.join('a', 'b', 'c', '/'));// 仅仅是拼接，不会产生绝对路径 遇到/也会拼在一起
// // a\b\c\
// console.log(path.extname('a.min.js'));// .js
// console.log(path.basename('a.js', 's')); // a.j
// console.log(path.relative('a/b/c', 'a'));// ..\.. 根据路径获取相对路径
// console.log(path.dirname('a/b/c'));// a/b 获取当前文件的父路径 __dirname的实现就是path.dirname

//=====================================
// 字符串如何变成js来执行
// 1.eval 会受执行环境的影响
// 2.new Function 模板引擎的实现原理，可以获取全局变量，还是会有污染的情况

// var a = 100;
// new Function('b', 'console.log(a)')(); // ReferenceError: a is not defined
// 并不会向上一级作用域查找。它总是被创建于全局环境，因此在运行时，它们只能访问全局变量和自己的局部变量。

// 3.node中自己实现了一个模板 vm 不受影响 （沙箱环境）。如何实现沙箱？快照（执行前记录信息，执行后还原信息）、proxy来实现。

//===============================
// const vm = require('vm');
// global.a = 100;
// vm.runInThisContext('console.log(a)'); // 100
// vm.runInNewContext('console.log(a)');//  a is not defined
// 在node中全局变量是在多个模块下共享的，所以不要通过global定义属性

/**
1. 全局1个上下文 global.a = xx 是定义在全局上下文中。全局上下文执行的时候相当于创建一个函数
  function(exports,module,require,__dirname, __filename)。
  runInThisContext 创建一个新的上下文，与上面的函数同级，所以也可以访问a。不会产生函数
2.runInNewContext 创建一个新的环境，与全局上下文同级。所以不能访问global中的变量
 */

//=====================================
/**
require的实现：
1. 读取文件
2. 读取后给文件包装一个函数
3. 通过runInThisContext将它变成js语法
 */

// // 2. 包装一个函数
// let a = (function (exports, module, require, __dirname, __filename) {
//   module.eports = 'a'; // 1. 读取文件

//   return module.exports;
// })(...5个参数)

// 1. require方法 -》Module.proottpe.require方法
// 2. Module._load加载模块
// 3. Module._resolveFilename 方法把路径变成了绝对路径 添加后缀名（.js .json)
// 4. new Module 拿到绝对路径创造一个模块 this.id exports={}
// 5. module.load 对模块进行加载
// 6. 根据文件后缀 Module._extension['js']去做策略加载
// 7. 用的是同步读取文件
// 8. 增加一个函数的壳子，并且让函数执行，让module.exports作为this
// 9. 用户会默认拿到了module.exports的返回结果

// 模板引擎的实现原理