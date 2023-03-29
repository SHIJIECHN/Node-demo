// 默认执行文件使用node来执行，他会把这个文件当成一个模块，此时this是空对象，模块中默认把this给修改了
console.log(this);// 空对象 {}

// 在前端中访问变量通过window属性，但是在后端中，想访问全局需要通过global
console.dir(global);

let argv = process.argv.slice(2).reduce((memo, current, index, arr) => {
  if (current.startsWith('--')) {
    memo[current.slice(2)] = arr[index + 1];
  }
  return memo;
}, {});
console.log(argv);
/**
 * 终端执行：node 1.js --port 3000 --info abc
 * 执行结果：{ port: '3000', info: 'abc' }
 */