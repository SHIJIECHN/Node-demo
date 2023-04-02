const fs = require('fs');

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
// let flag = ws.write(1 + '');// 写入的内容，只能是string 或者buffer
// console.log(flag)

// 写入的过程是异步的，flag不代表写入是否成功。
let flag = ws.write(1111 + '');
flag = ws.write(2222 + '');
flag = ws.write(3333 + '');

// 第一个是真正的向文件中写入，其他的写入会排队[222,333]
// 如果flag返回false，就不要继续写入了，如果再写入的话，肯定会超出预期