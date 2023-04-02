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