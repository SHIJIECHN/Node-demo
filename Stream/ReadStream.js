const fs = require('fs');
const EventEmitter = require('events');
// 实例可以使用on方法，说明继承至EventEmitter
class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    // 参数处理
    this.path = path;
    this.flag = options.flag || 'r';
    this.mode = options.mode || 438;
    this.start = options.start || 0;
    this.end = options.end;
    this.autoClose = options.autoClose || true;
    this.highWaterMark = options.highWaterMark || 64 * 1024;// 默认64K
    this.encoding = options.encoding || 'utf8';
    this.pos = this.start; // 每次读取的位置，默认等于开始的位置

    // 默认是非流动模式 rs.pause rs.resume
    this.flowing = null; // 开始读取的时候，需要把这个值改成true

    // 要读取文件 需要打开文件夹。实例化的时候就执行一次open，不管有没有监听data
    this.open();

    // events事件：on，emit，once，newListener。当调用on方法时，就会触发newListener，并将事件名传给newListener

    this.on('newListener', (type) => {
      // console.log(type);
      // 用户监听了data事件
      if (type === 'data') {
        this.flowing = true; // 开始读取
        this.read();
      }
    })

  }
  read() {
    // 默认第一次read方法，肯定拿不到fd的，但是等一会如果触发了open事件，肯定可以获得this.fd

    if (typeof this.fd !== 'number') { // 没有this.fd 。保证文件描述符存在的时候，才调用read方法来读取
      return this.once('open', () => this.read()) // 把open事件存起来，当open事件触发的时候，就会执行
    }
    // highWaterMark每次读取的个数。
    // 默认如果没有end，每次读取highWaterMark。如果有end，就需要end来算最后一次熬读取多少
    let howMuchToRead = this.end
      ? Math.min((this.end - this.pos + 1), this.highWaterMark)
      : this.highWaterMark;
    const buffer = Buffer.alloc(howMuchToRead); // 每次的Buffer
    fs.read(this.fd, buffer, 0, buffer.length, this.pos, (err, bytesRead) => {
      if (err) {
        return;
      }
      if (bytesRead) { // 如果能读取到内容，而且flowing为true就继续读取
        this.pos += bytesRead; // 维护每次读取的位置
        const data = buffer.slice(0, bytesRead);
        this.emit('data', this.encoding // 判断是否有外部传入的编码方式，如果有则使用改编码方式字符输出，没有则输出buffer
          ? data.toString(this.encoding)
          : data
        ); // 将结果发射出去
        if (this.flowing) {
          this.read();
        }
      } else {
        this.emit('end');
        if (this.autoClose) {
          fs.close(this.fd, () => {
            this.emit('close');
            this.flowing = null;
          })
        }
      }
    });
  }
  open() {
    fs.open(this.path, this.flag, (err, fd) => {
      if (err) {
        this.emit('error');
        return;
      }
      this.fd = fd; // 代表当前文件的描述符 number类型，fs.read()方法还会用到这个参数
      this.emit('open', this.fd);
    })
  }
  pause() {
    this.flowing = false;
  }
  resume() {
    this.flowing = true;
    this.read(); // 继续读
  }

  pipe(ws) {
    this.on('data', (chunk) => {
      let flag = ws.write(chunk);
      if (!flag) {
        this.pause();
      }
    })

    ws.on('drain', () => {
      this.resume()
    })
  }
}

module.exports = ReadStream;