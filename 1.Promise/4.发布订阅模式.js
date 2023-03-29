const fs = require('fs');
// 发布订阅模式核心就是把多个方法先暂存起来，最后一次执行，
// 主要解决的问题是解耦。可以把订阅的逻辑分散到各个类中

// 事件中心
let events = {
  _events: [],

  on(fn) {
    this._events.push(fn)
  },
  emit(data) {
    this._events.forEach(fn => fn(data));
  }
}

// 订阅有顺序
events.on(() => {
  console.log('每读一次，就触发一次');
});

let arr = [];
events.on((data) => {
  arr.push(data);
});

events.on((data) => {
  if (arr.length === 2) { // 最终结果还是计数器
    console.log('读取完毕')
  }
});


fs.readFile('./a.txt', 'UTF8', function (err, data) {
  events.emit(data);
})
fs.readFile('./b.txt', 'UTF8', function (err, data) {
  events.emit(data);
})

