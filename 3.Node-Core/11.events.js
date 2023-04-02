const EventEmitter = rquire('events');

// 发布订阅模式redux vue express koa webpack
/**
常见的方法：
- 订阅方法
- 发布方法
- 取消方法
- 订阅一次
 */


function Girl() {

}
// 继承对象原型方法：
// 第一种方式：直接继承（互相影响）
Girl.prototype.__proto__ = EventEmitter.prototype;
// 第二种方式：setPrototypeOf。同上面一种方式一样
Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype);
// 第三种方式：Object.create（使用）
Girl.prototype = Object.create(EventEmitter.prototype);

// Object.create()原型继承的原理实现
function create(proto) {
  function Fn() { };
  Fn.prototype = proto;
  return new Fn(); // 它上面有所有EventEmitter.prototype方法

}
