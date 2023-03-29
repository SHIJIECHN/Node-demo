const fs = require('fs');

function after(times, callback) {// 高阶函数
  let arr = [];// 目前我们不关心顺序
  return (data) => {
    arr.push(data);// 保证顺序，可以使用索引
    if (--times === 0) { // 多个请求并发，需要计数器实现
      callback(arr)
    }
  }
}

let out = after(2, (arr) => {
  console.log(arr);// [ 'a', 'b' ]
})

fs.readFile('./Promise/a.txt', 'utf-8', function (err, data) {
  out(data); // 每次执行完，通知我
});
fs.readFile('./Promise/b.txt', 'utf-8', function (err, data) {
  out(data);
})
