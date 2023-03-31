// 判断一个变量的类型（代码的实现，类型的基本条件）
// typeof 我们用于判断基础类型
// instanceof xxx是谁的实例 原理
// Object.prototype.toString.call 判断具体类型，返回的是一个字符串
// constructor

function currying(fn) {
  // 1. 存储每次调用的时候传入的变量
  const inner = (args = []) => { // args存储每次调用时传入的参数

    if (args.length >= fn.length) {
      return fn(...args); // 原来的函数执行
    } else {
      // userArgs是每次传入的参数
      return (...userArgs) => inner([...args, ...userArgs]); // 返回inner，并且参数拼接
    }
  }
  return inner();
}


function isType(typing, val) {
  return Object.prototype.toString.call(val) === `[object ${typing}]`;
}

let util = {};
['String', 'Number', 'Boolean', 'Null', 'Undefined'].forEach(type => {
  util['is' + type] = currying(isType)(type);
})

console.log(util.isString('abc')); // true
console.log(util.isString(123)); // false



// console.log(isType('abc', 'String'))

// 柯里化：让函数变得更具体一些
// 反柯里化：让函数范围变得更大一些

// function isString(typing) {
//   return function (val) {
//     return Object.prototype.toString.call(val) === `[object ${typing}]`;
//   }
// }
// let myIsString = isString('String');
// console.log(myIsString('abc'));
// console.log(myIsString(123));

// 实现通用的柯里化函数：高阶函数

// 思路：我要记录每次调用时传入的参数，并且和函数的参数个数进行比较，
// 如果不满足总个数，就返回新函数，如果传入的个数和参数一致，执行原来的函数

// function currying(fn) {
//   // fn.length; // 函数参数的个数
//   // 1. 存储每次调用的时候传入的变量
//   const inner = (args = []) => { // args存储每次调用时传入的参数

//     if (args.length >= fn.length) {
//       return fn(...args); // 原来的函数执行，也就是sum执行
//     } else {
//       // userArgs是每次传入的参数
//       return (...userArgs) => inner([...args, ...userArgs]); // 返回inner，并且参数拼接
//     }
//   }
//   return inner();
// }

// function sum(a, b, c, d) {
//   return a + b + c + d
// }

// let sum1 = currying(sum);
// let sum2 = sum1(1);
// let sum3 = sum2(2, 3);
// let result = sum3(4);

// console.log(result)

