letfs = require('fs');

let { Readable, Duplex, Transform } = require('stream');
class MyReadStream extends Readable {
  constructor() {
    super();
    this.index = 5;
  }
  _read() {
    if (this.index-- == 0) { // fs.creteReadStream 重写了_read方法
      return this.push(null);
    }
    this.push(this.index + '');
  }
}
let rs = new MyReadStream();
rs.on('data', function (chunk) {
  console.log(chunk);
})
/**
<Buffer 34>
<Buffer 33>
<Buffer 32>
<Buffer 31>
<Buffer 30>
 */

class MyDuplex extends Duplex {
  _read() { }
  _write() { }
}

// 转化流：压缩、转码
// 在对输入 过程进行一个转化操作，将输入的值，转换成大写的
class MyTransform extends Transform {
  _transform(chunk, encoding, cb) { // 参数和可写流一样
    chunk = chunk.toString().toUpperCase();
    this.push(chunk); // 和可读流一样的，需要push数据才能，触发data事件
    cb();
  }
}
let transform = new MyTransform();

process.stdin.pipe(transform).pipe(process.stdout);