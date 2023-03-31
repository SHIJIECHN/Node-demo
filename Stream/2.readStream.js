let fs = require('fs');
let ReadStream = require('./ReadStream')
console.log('my')
let rs = new ReadStream('./name.txt', {
  flag: 'r',
  highWaterMark: 3,
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
  console.log(chunk);
  // str.push(chunk);
})

rs.on('end', () => {
  // console.log(Buffer.concat(str).toString());
  console.log('读取完毕')
})

rs.on('close', () => {
  console.log('文件关闭了')
})

