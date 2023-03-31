const fs = require('fs');
const Events = require('events');
class WriteStream extends Events {
  constructor(path, options) {
    super();
    this.path = path;
    this.flag = options.flag || 'w';
    this.mode = options.mode || 0o666;
    this.autoClose = options.autoClose || true;
    this.encoding = options.encoding || 'utf8';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.start = options.start || 0;
    this.fd = null;

    this.cache = [];// 缓存多次写入的数据。源码使用链表
    this.len = 0; // 维护写入的长度 len
    this.needDrain = false; // 是否触发drain事件
    this.writing = false; // 如果正在写入就放入缓存中

    this.open()
  }
  open() {
    fs.open(this.path, this.flag, (err, fd) => {
      if (err) {
        return this.emit('error');
      }
      this.fd = fd;
      this.emit('open');
    })
  }

  write(chunk, encoding = this.encoding, callback) {
    // 第一次是真正的向文件中写入，之后都放在内存中了
    // 判断是不是buffer，如果不是buffer就需要转成buffer，在重新赋值。把传入的内容统一转换成buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length; // 修改长度
    if (this.len >= this.highWaterMark) { // 清空后需要触发drain事件
      this.needDrain = true;
    }

    // write方法要有一个返回结果
    if (this.writing) {
      this.cache.push({
        chunk,
        encoding,
        callback
      })
    } else {
      // 如果没有写入，则把状态修改为正在写入，并开始写
      this.writing = true; // 正在写入
      this._write()
    }
    return !this.needDrain; // this.len < this.highWaterMark
  }

}
module.exports = WriteStream