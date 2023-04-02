const fs = require('fs');
const path = require('path');

// fs模块中基本上有两种api（同步、异步）
// 同步：运行之前想把文件都操作完
// 异步：代码运行执行都用异步

// I/O input output 读文件（以内存为参照物） -> 写文件

// 推荐使用绝对路径。
// 读取的时候默认不写编码是buffer类型，如果文件不存在则报错
// 写入的时候默认将内容以utf8格式写入，如果文件不存在会创建

// 如果采用嵌套的写法，就只能读取完毕后再写入，能不能边读边写
// 大文件用此方法会导致淹没可用内存。此方式适合小文件
fs.readFile(path.resolve(__dirname, 'package.json'), function (err, data) {
  // console.log(data); // <Buffer 7b 0a 20 20 22 ... 231 more bytes>
  if (err) return console.log(err);

  fs.writeFile(path.resolve(__dirname, './test.js'), data, function (err, data) {
    // console.log(data);
  })
})

// fs.read 
let buf = Buffer.alloc(3);// [0,0,0]
fs.open(path.resolve(__dirname, 'a.txt'), 'r', function (err, fd) {
  // fs file descriptor 是一个number类型
  // console.log(fd);
  // 读取a.txt 将读取到的内容写入到buffer的第0个位置写3个，从文件的第六个位置开始写入
  fs.read(fd, buf, 0, 3, 6, function (err, bytesRead) { // bytesRead是读取到的真实个数
    console.log(buf); // <Buffer 37 38 39>
    fs.open(path.resolve(__dirname, 'b.txt'), 'w', function (err, wfd) {
      // 将buffer的数据从0开始读取3个 写入到文件的第0个位置
      fs.write(wfd, buf, 0, 3, 0, function (err, written) {
        console.log(written);
        fs.close(fd, () => { });
        fs.close(wfd, () => { })
      });
    })
  })
})
