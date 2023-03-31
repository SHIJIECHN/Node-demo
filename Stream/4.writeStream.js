const fs = require('fs');
const WriteStream = require('./WriteStream.js')

const ws = new WriteStream('./name.txt', {
  falg: 'w',
  mode: 0o666,
  autoClose: true,
  encoding: 'utf8',
  highWaterMark: 2, // highWaterMark预期使用的内存，默认16*1024
})

let flag = ws.write(1 + '');
console.log(flag);
flag = ws.write(1 + '')
console.log(flag);
flag = ws.write(1 + '')
console.log(flag);

// let i = 9; // 每次都耗两个字节内存
// function write() { // 预计2个
//   let flag = true;
//   while (i && flag) {
//     flag = ws.write(i-- + ''); // 写两个就停
//   }
// }
// write();
// // 抽干，当我们预计的大小和写入的内容的大小相等或者写入的内容大于了预计的内存会触发此方法，
// // 当我们的写入的内容都写入完成后会触发此方法
// ws.on('drain', () => {
//   write()
// })

/**
 * 过程：
 * 1. 第一次写入2个字节后，内存满了，当我把内容都写到文本里面了，内存就会被释放
 * 2. 触发drain，再次执行write
 */
