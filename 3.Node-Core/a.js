// this指代的是当前模块的导出对象
console.log(module.exports === exports, this === module.exports); // true true 三者相等
module.exports = 'hello'; // 内部会将module.exports直接导出

exports = 'hello';
/**
 * 模块中使用 exports = 'hello'导出，与使用 module.exports = 'hello'导出结果不一样。
 * 说明：
 * function(){
 *  let exports = module.exports; // 将module.exports赋给exports
 *  exports = 'hello'; // 将exports值改为 hello。module.exports不受影响
 *  return module.exports;
 * }
 */

// 可以使用下面的方式导出
exports.a = 'hello';
exports.b = 'world';

/**
 * function(){
 *  let exports = module.exports; // 将module.exports赋给exports，指向同一个对象
 *  exports.a = 'hello'; // 增加属性 a
 *  exports.b = 'hello'; // 增加属性 b
 *  return module.exports;
 * }
 */

// 也可以使用下面的方式导出
this.a = 'hello';
this.b = 'world';


// 下面导出方式最终导出什么结果
module.exports = 'hello'; // 最终导出。更改module.exports优先级是最高的，因为最终会将module.exports直接导出
exports.a = 'world';
this.a = '.'

/**
 * function(){
 *  let exports = module.exports; // 将module.exports赋给exports，指向同一个对象
 *  module.exports = 'hello; // 将module.exports指向hello
 *  exports.a = 'hello'; // 增加属性 a 为world。这是在原来的对象上加属性
 *  return module.exports; 
 * }
 */