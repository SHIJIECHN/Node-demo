/**
 * 第一次向文件中写入，第二次把内容放到缓存中
 * 第一次写入成功后，清空缓存第一项，缓存第一项清空后，再清空第二个
 * 都清空后再看是够触发了drain事件，是的话重新执行
 */
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
    this.pos = this.start; // 写入非位置

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

  write(chunk, encoding = this.encoding, callback = () => { }) {
    // 第一次是真正的向文件中写入，之后都放在内存中了
    // 判断是不是buffer，如果不是buffer就需要转成buffer，在重新赋值。把传入的内容统一转换成buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    this.len += chunk.length; // 修改长度
    if (this.len >= this.highWaterMark) { // 清空后需要触发drain事件
      this.needDrain = true;
    }

    // write方法要有一个返回结果
    if (this.writing) {
      this.cache.push({ // 把当前写的存入缓存区
        chunk, // 内容
        encoding, // 编码
        callback
      })
      // 第一次写完怎么知道写第二个？
    } else {
      // 如果没有写入，则把状态修改为正在写入，并开始写
      this.writing = true; // 正在写入
      this._write(chunk, encoding, () => {
        callback(); // 回调
        this.clearBuffer(); // 清理数组的第一项
      }); // 开始写入
    }
    return !this.needDrain; // this.len < this.highWaterMark
  }
  clearBuffer() {
    let obj = this.cache.shift();
    if (obj) {
      this._write(obj.chunk, obj.encoding, () => {
        // 当自己写入成功后，继续清空缓存，直到缓存区为空
        obj.callback();
        this.clearBuffer();
      })
    } else { // 缓存已经干了
      if (this.needDrain) { // 需要触发drain
        this.needDrain = false;
        this.writing = false; // 不是正在写入，下次写入时，依然是第一个往文件里写，剩下的向缓存中写入
        this.emit('drain')
      }
    }
  }

  _write(chunk, encoding, callback) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, encoding, callback));
    }
    // 写入时可以不用加pos
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, written) => {
      this.pos += written;
      this.len -= written; // 每次写入成功后，都需要把缓存的大小减少
      callback();// 当写入成功后，调用callback，会执行clearBuffer方法
    })
  }

}
module.exports = WriteStream