
// let rs = fs.createReadStream('./name.txt', { highWaterMark: 4 });
// let ws = fs.createWriteStream('./name1.txt', { highWaterMark: 1 });
let ReadStream = require('./ReadStream.js');
let WriteStream = require('./WriteStream.js');

let fs = require('fs');

let rs = fs.createReadStream('./name.txt', { highWaterMark: 4 });
let ws = fs.createWriteStream('./name1.txt', { highWaterMark: 1 });

// 读文件。先读64k，我就拿着64K去写，超过16K 就别读了，等我把64K写入完毕后，你再去读取
rs.on('data', function (chunk) {
  console.log(chunk);
  let flag = ws.write(chunk); // 写入文件，写满之后，暂停不要读取了
  if (!flag) { // 内存读满了，highWaterMark为1，
    rs.pause(); // 暂停
  }
})

// 写完成后
ws.on('drain', () => {
  console.log('执行drain');
  rs.resume();// 恢复继续读
})

// rs.pipe(ws); // 通过pipe可以实现拷贝
// 拿不到读写的内容或者写入的内容，不能控制中间的流程