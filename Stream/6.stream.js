letfs = require('fs');

let { Readable } = require('stream');
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