const EventEmitter = require('./events');
const util = require('util')

function Girl() {

}
util.inherits(Girl, EventEmitter); // 原型继承 需要通过实例来调用继承

let girl = new Girl();

const cry = (a, b) => {
  console.log('哭')
}

// '女生失恋': [fn1, fn2]
girl.on('女生失恋', cry)
girl.on('女生失恋', (a, b) => {
  console.log('吃')
})
const fn = () => {
  console.log('逛街')
}
girl.once('女生失恋', fn)

setTimeout(() => {
  girl.off('女生失恋', fn);
  girl.emit('女生失恋', 'a', 'b')
  girl.off('女生失恋', cry); // 移除
  girl.emit('女生失恋', 'a', 'b')
}, 1000)

/**
哭
吃
吃
 */

