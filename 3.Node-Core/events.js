function EventEmitter() {
  this._events = {};
}
EventEmitter.prototype.on = function (eventsName, callback) {
  if (!this._events) {
    this._events = {}
  }
  if (this._events[eventsName]) {
    this._events[eventsName].push(callback); // {女生失恋: [fn1, fn2]}
  } else { // {女生失恋: [fn1]}
    this._events[eventsName] = [callback]
  }
}
EventEmitter.prototype.emit = function (eventName, ...args) {
  this._events[eventName].forEach(fn => {
    fn(...args);
  })
}
EventEmitter.prototype.off = function (eventName, callback) {
  if (this._events && this._events[eventName]) {
    // 如果存储的方法和传入非不一样就留下，一样的就留下
    this._events[eventName] = this._events[eventName]
      .filter(fn => fn !== callback && fn.l !== callback);
  }
}

EventEmitter.prototype.once = function (eventName, callback) {
  // 注意：callback执行完再删除
  const one = () => { // 绑定执行完毕后再删除
    callback(); // 切片变成目的就是增加自己的逻辑
    this.off(eventName, one);
  }
  one.l = callback; // 自定义属性，与callback关联起来
  this.on(eventName, one);
}

module.exports = EventEmitter;