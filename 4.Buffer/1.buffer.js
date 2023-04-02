// // let sum = 0;
// // for (let i = 0; i < 8; i++) {
// //   sum += Math.pow(2, i);
// // }
// // console.log(sum); // 每个字节最大值为255

// console.log(parseInt('101', 2))// 5 把任意进制转化成10机制
// // 0b 二进制  0x 16进制
// console.log((0x64).toString(2)); // 1100100 将任何进制转成任意进制

// // 小数也要转化成2进制
// // 10进制中的0.5是2进制中的多少？10 -> 0.5  2 -> 0.1
// // 10进制中的0.5就是2进制中的0.1  乘2取整法可以将一个小数转化成转化成2进制数
// // 0.1 * 2 = 0.2  0
// // 0.2 * 2 = 0.4  0
// // 0.4 * 2 = 0.8  0
// // 0.8 * 2 = 1.6  1
// // 0.6 * 2 = 1.2  1

// console.log(0.1 + 0.2); // 0.30000000000000004 进制转换问题
// // 0.2 + 0.2 那如果出现了精度问题你要如何解决
// // JS没有把小数转化成2进制的方法

// // 在服务端，我们需要一个东西可以来标识内存。但是不能是字符串，因为字符串无法标识图片
// // node中用Buffer来标识内存的数据 它把内容转换成了16进制来显示（16进制比较短）
// // 10进制 -> 255 2进制 -> 0b11111111  16进制 -> 0xff
// // buffer每个字节的取值返回就是0 ~ 0xff
// // node中buffer可以和字符串任意的转换（可能会出现乱码）

// // 编码规范：ASCII -> GBK -> unicode -> UTF8

// // Buffer代表的是内存，内存是一段固定的空间，产生的内存是固定大小，不能随意添加
// // 扩容的概念：需要动态创建一个新的内容，把内容迁移故去

// // npm install @types/node 可以支持提示功能
// const buffer1 = Buffer.alloc(5); // 固定长度5
// console.log(buffer1); // <Buffer 00 00 00 00 00> 像数组，但是和数组有区别。数组可以扩展，buffer不能扩展，可以用索引取值，buffer[0]取出来的值是10进制

// let buffer2 = Buffer.from([0x25, 0x26, 0x64]);
// console.log(buffer2); // <Buffer 25 26 64> 此用法用得非常少，我们不会直接填16进制

// let buffer3 = Buffer.from('珠峰');// 6个字节
// console.log(buffer3); // <Buffer e7 8f a0 e5 b3 b0>

// // 一般情况下，我们会用alloc来声明一个buffer，护着把字符串转成buffer使用
// // 后台获取的数据多数情况下都是buffer，包括后面的文件操作也都是buffer形式

// // base64编码，在后期使用的过程中用的非常多（base64没有加密功能）所有人都知道这个规范

// // base64 可以放到任何路径的链接里（可以减少请求的发送）文件大小会变大，base64转化完毕后会比之前的文件大1/3

// const r = Buffer.from('珠').toString('base64'); // 可以调用toString方法转化成指定的编码
// console.log(r); // 54+g
// // base64的来源就是将每个字节都转化成小于64的值
// console.log(0xe7.toString(2)); // 11100111
// console.log(0x8f.toString(2)); // 10001111
// console.log(0xa0.toString(2)); // 10100000

// // 11100111 10001111 10100000 => 3 * 8 转换成
// // 111001 111000 111110 100000 => 4 * 6

// console.log(parseInt('111001', 2)); // 57
// console.log(parseInt('111000', 2)); // 56
// console.log(parseInt('111110', 2)); // 62
// console.log(parseInt('100000', 2)); // 32

// // 0-63 取值范围是64
// let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// str += str.toLocaleLowerCase();
// str += '0123456789+/';
// // 57 56 62 32
// console.log(str[57] + str[56] + str[62] + str[32]); // 54+g

// let buffer4 = Buffer.from([1, 2, 3, 4, 5]); // 内部存的是引用地址
// let buffer5 = buffer4.slice(0, 1);
// buffer5[0] = 100; // buffer4第0个也会发生改变
// console.log(buffer5, buffer4); // <Buffer 64> <Buffer 64 02 03 04 05>

// // copy 可以将buffer的数据拷贝到另一个buffer上（一般用不到,concat是基于copy）
// let buf0 = Buffer.from('架构');
// let buf1 = Buffer.from('珠');
// let buf2 = Buffer.from('峰');

// let bigBuffer = Buffer.alloc(12); // 珠峰架构

// // 把buf0拷贝到bigBuffer，Buffer.copy(target, targetStart, sourceStart, sourceEnd)
// buf0.copy(bigBuffer, 6, 0, 6);
// buf1.copy(bigBuffer, 0, 0, 3);
// buf2.copy(bigBuffer, 3); // 默认后两个参数不用传递

// console.log(bigBuffer.toString());// 珠峰架构

// concat
let buf0 = Buffer.from('架构');
let buf1 = Buffer.from('珠');
let buf2 = Buffer.from('峰');

console.log(Buffer.concat([buf0, buf1, buf2]).toString()); // 架构珠峰
console.log(Buffer.concat([buf0, buf1, buf2], 6).toString()); // 架构 只取6个


// buffer.length
// let bigBuffer = Buffer.concat([buf0, buf1, buf2], 100)
// console.log(bigBuffer.byteLength);// 100
// console.log(bigBuffer.length); // 100
// console.log(Buffer.from('珠峰').length); // 6

// isBuffer
let bigBuffer = Buffer.concat([buf0, buf1, buf2], 100)
console.log(Buffer.isBuffer(bigBuffer)); // true
