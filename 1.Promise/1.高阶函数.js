
function core(...args) {
  console.log('core', args);
}
// 给core函数增加一些额外的逻辑，但是不能更改核心代码

Function.prototype.before = function (cb) {
  // this = core 谁调的before，this就指向谁
  return (...args) => { // newCore 剩余运算符可以把多个参数转化成数组
    cb();
    this(...args); // core()执行
  }
}

// before就是一个高阶函数
let newCore = core.before(() => {
  console.log('before')
});

newCore('a', 'b');
/**
before
core [ 'a', 'b' ]
 */

// 1. 如果我们想给函数进行扩展，可以使用高阶函数

// 函数柯里化