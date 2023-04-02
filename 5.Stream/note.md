## 分类

文件操作读与写：可读流和可写流 （fs.read, fs.write) 异步读写

name.txt
```txt
012345678
```

```js
let fs = require('fs');

let rs = fs.createReadStream('./name.txt', {
  flag: 'r', // 打开文件做什么事， r w e+ w+ a
  highWaterMark: 1, // 限制每次都多少。每次读一个，1代表字节数。默认每次读写64K文件内容
  mode: 0o666, // 可读可写
  start: 0, // 开始读取的位置
  end: 3, // 包含3。结束读取的位置
  encoding: 'utf8', // 编码
  autoClose: true, // 读完以后是否自动关闭。true关闭
});

// console.log(rs); // rs是内部new ReadStream()产生的

rs.on('error', () => {
  console.log('出错了')
})

// open、close只针对文件的读，
rs.on('open', () => { // 监听打开事件
  console.log('文件打开了')
})

// 默认创建可读流不会马上读取，如果我们监听了data事件，就可以读文件
// 默认非流动模式 => 变成流动模式
let str = ''
rs.on('data', (chunk) => {
  str += chunk;
  console.log(chunk); // 0-3是4个字节，每次读一个，所以输出0 1 2 3
})

// 读取完毕，拿到结果
rs.on('end', () => {
  console.log(str); // '0123'
  console.log('读取完毕')
})

rs.on('close', () => { // 监听打开事件
  console.log('文件关闭了')
})
```

案例二：读取汉字

name.txt
```txt
珠峰
```

```javascript
let fs = require('fs');

let rs = fs.createReadStream('./name.txt', {
  flag: 'r', // 打开文件做什么事， r w e+ w+ a
  highWaterMark: 2, // 限制每次都多少。每次读一个，1代表字节数。默认每次读写64K文件内容 ///////////// 每个汉字是3个字节
  mode: 0o666, // 可读可写
  start: 0, // 开始读取的位置
  end: 6, // 包含3。结束读取的位置 /////////////
  // encoding: 'utf8', // 编码 ////////////// 
  autoClose: true, // 读完以后是否自动关闭。true关闭
});

// console.log(rs); // rs是内部new ReadStream()产生的

rs.on('error', () => {
  console.log('出错了')
})

// open、close只针对文件的读，
rs.on('open', () => { // 监听打开事件
  console.log('文件打开了')
})

// 默认创建可读流不会马上读取，如果我们监听了data事件，就可以读文件
// 默认非流动模式(暂停模式) => 变成流动模式
let str = []; //拼接buffer
rs.on('data', (chunk) => {
  str.push(chunk); // 读取到的是Buffer
})

// 读取完毕，拿到结果
rs.on('end', () => {
  console.log(Buffer.concat(str).toString()); // 珠峰
  console.log('读取完毕')
})

rs.on('close', () => { // 监听打开事件
  console.log('文件关闭了')
})
```

案例三：暂停和恢复

```javascript
let fs = require('fs');

let rs = fs.createReadStream('./name.txt', {
  flag: 'r', // 打开文件做什么事， r w e+ w+ a
  highWaterMark: 2, // 限制每次都多少。每次读一个，1代表字节数。默认每次读写64K文件内容 
  mode: 0o666, // 可读可写
  start: 0, // 开始读取的位置
  end: 6, // 包含3。结束读取的位置 
  // encoding: 'utf8', // 编码
  autoClose: true, // 读完以后是否自动关闭。true关闭
});

// console.log(rs); // rs是内部new ReadStream()产生的

rs.on('error', () => {
  console.log('出错了')
})

// open、close只针对文件的读，
rs.on('open', () => { // 监听打开事件
  console.log('文件打开了')
})

// 默认创建可读流不会马上读取，如果我们监听了data事件，就可以读文件
// 默认非流动模式 => 变成流动模式
let str = []; //拼接buffer
rs.on('data', (chunk) => {
  str.push(chunk); // 读取到的是Buffer
  console.log(chunk); // 每隔一秒输出一次
  rs.pause();// 停止data事件的触发 //////////
})

// 过一秒恢复
setInterval(() => {
  rs.resume(); // 恢复data事件 ////////
}, 1000)

// 读取完毕，拿到结果
rs.on('end', () => {
  console.log(Buffer.concat(str).toString()); // 珠峰
  console.log('读取完毕')
})

rs.on('close', () => { // 监听打开事件
  console.log('文件关闭了')
})
```

可读流的事件：
- data
- end
- 只有文件流才有的(open,close)
- 控制流：pause，resume


## 可读流实现

### 1. 初始化与open

```javascript
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

    // 默认是非流动模式 rs.pause rs.resume
    this.flowing = null; // 开始读取的时候，需要把这个值改成true

    // 要读取文件 需要打开文件夹。实例化的时候就执行一次open，不管有没有监听data
    this.open();

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
}

module.exports = ReadStream;
```

```javascript
let fs = require('fs');
let ReadStream = require('./ReadStream')
console.log('my')
let rs = new ReadStream('./name.txt', {
  flag: 'r',
  highWaterMark: 2,
  mode: 0o666,
  start: 0,
  end: 6,
  encoding: 'utf8',
  autoClose: true,
});


rs.on('error', () => {
  console.log('出错了')
})


rs.on('open', () => {
  console.log('文件打开了')
})


let str = [];
rs.on('data', (chunk) => {
  console.log(chunk)
})

rs.on('end', () => {
  console.log('读取完毕')
})

rs.on('close', () => {
  console.log('文件关闭了')
})

/**
my
文件打开了
*/
```

### 2. data
内部如何知道监听了data事件

```javascript
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
    console.log('用户监听了data事件，开始读取了')
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
}

module.exports = ReadStream;
```

```javascript
my
用户监听了data事件，开始读取了
用户监听了data事件，开始读取了
用户监听了data事件，开始读取了
用户监听了data事件，开始读取了
用户监听了data事件，开始读取了
文件打开了
```

- 此时先执行了read(同步)后，才会执行open(异步)，而在read中使用this.fd为undefined
- open执行结束后，this.fd才会有值，获得fd之后会再触发open事件
- 所以需要在read中进行判断，如果this.fd没有值，先将监听open事件存储起来，当open事件触发之后，再次执行read方法

```javascript
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

    if (typeof this.fd !== 'number') { // 没有this.fd
      return this.once('open', () => this.read()) // 把open事件存起来，当open事件触发的时候，就会执行
    }

    console.log(this.fd)
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
}

module.exports = ReadStream;
```

获得this.fd后read方法继续执行：

```javascript
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
      if (bytesRead > 0) { // 如果能读取到内容，而且flowing为true就继续读取
        this.pos += bytesRead; // 维护每次读取的位置
        // 将结果发射出去
        this.emit('data', this.encoding // 判断是否有外部传入的编码方式，如果有则使用改编码方式字符输出，没有则输出buffer
          ? buffer.toString(this.encoding)
          : buffer
        ); 
        if (this.flowing) {
          this.read();
        }
      } else {
        this.emit('end');
        if (this.autoClose) {
          fs.close(this.fd, () => { // 关闭文件
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
}

module.exports = ReadStream;
```

```javascript
my
文件打开了
012
345
6
读取完毕
文件关闭了
```

整体流程：
1. 先把文件打开
2. 监听用户有没有监听data事件，如果监听data事件，需要修改flowing模式并开始读取
3. 但是读取的时候发现open时异步的，所以需要需要等待当前文件打开后，再去读取
4. 读取文件，把文件放到buffer中，不停维护偏移量，如果时流动模式的话就继续读取，知道读取到的内容为空，就结束



## 可写流

### 1. 基本使用
```javascript
const ws = fs.createWriteStream('./name.txt', {
  falg: 'w',
  mode: 0o666,
  autoClose: true,
  encoding: 'utf8',
  highWaterMark: 1, // highWaterMark预期使用的内存，默认16*1024
})

// 可写流。文件中有close，open。write end on('diran')

// 写一个1，预计使用的内存是highWaterMark为1，再往里面写就超出内存了，此时flag为false
// 如果highWaterMark为2，flag为true
// 只要写入的内容长度大于了预期，就返回false
let flag = ws.write(1 + '');// 写入的内容，只能是string 或者buffer
console.log(flag)
```

Q:ws.write()是同步还是异步的？   
A：异步的

```javascript

// 写入的过程是异步的，flag不代表写入是否成功。
let flag = ws.write(1111 + '');
flag = ws.write(2222 + '');
flag = ws.write(3333 + '');

// 第一个是真正的向文件中写入，其他的写入会排队[222,333]
// 如果flag返回false，就不要继续写入了，如果再写入的话，肯定会超出预期
```

写入9个数：
```javascript
const fs = require('fs');

const ws = fs.createWriteStream('./name.txt', {
  falg: 'w',
  mode: 0o666,
  autoClose: true,
  encoding: 'utf8',
  highWaterMark: 2, // highWaterMark预期使用的内存，默认16*1024
})

// 写入9个数
// 第一种方式： 耗9个字节的内存
// let i = 9; 
// while (i--) {
//   ws.write(i + '');
// }


// 第二种方式：每次都耗两个字节内存
let i = 9; 
function write() { // 预计2个
  let flag = true;
  while (i && flag) {
    flag = ws.write(i-- + ''); // 写两个就停
  }
}
write();
// 抽干，当我们预计的大小和写入的内容的大小相等或者写入的内容大于了预计的内存会触发此方法，
// 当我们的写入的内容都写入完成后会触发此方法
ws.on('drain', () => {
  write()
})

/**
 * 过程：
 * 1. 第一次写入2个字节后，内存满了，当我把内容都写到文本里面了，内存就会被释放
 * 2. 触发drain，再次执行write
 */

```

## 实现可写流

```javascript
const fs = require('fs');
const WriteStream = require('./WriteStream.js')

const ws = new WriteStream('./name.txt', {
  falg: 'w',
  mode: 0o666,
  autoClose: true,
  encoding: 'utf8',
  highWaterMark: 4, // highWaterMark预期使用的内存，默认16*1024
})


let i = 9; // 每次都耗两个字节内存
function write() { // 预计2个
  let flag = true;
  while (i && flag) {
    flag = ws.write(i-- + ''); 
  }
}
write();
ws.on('drain', () => {
  write()
})
```

```js
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
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
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
```

## pipe实现
:::: tabs
::: tab copy.js
```javascript
let fs = require('fs');
// let rs = fs.createReadStream('./name.txt', { highWaterMark: 4 });
// let ws = fs.createWriteStream('./name1.txt', { highWaterMark: 1 });
let ReadStream = require('./ReadStream.js');
let WriteStream = require('./WriteStream.js');

let rs = new ReadStream('./name.txt', { highWaterMark: 4 });
let ws = new WriteStream('./name1.txt', { highWaterMark: 1 });

// 读文件。先读64k，我就拿着64K去写，超过16K 就别读了，等我把64K写入完毕后，你再去读取
// rs.on('data', function (chunk) {
//   console.log(chunk);
//   let flag = ws.write(chunk); // 写入文件，写满之后，暂停不要读取了
//   console.log(flag)
//   if (!flag) { // 内存读满了，highWaterMark为1，
//     rs.pause(); // 暂停
//   }
// })

// // 写完成后
// ws.on('drain', () => {
//   console.log('执行drain')
//   rs.resume();// 恢复继续读
// })

rs.pipe(ws); // 通过pipe可以实现拷贝
```
:::   
::: tab ReadStream.js
```javascript
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
```
:::   
::: tab WriteStream.js
```javascript
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
```
:::   
::: tab name.txt
```txt
123456789
```
:::   
::::

