// crypto是我们node中提供好的用于加密的包，各种摘要算法和加密算法

// md5 算法 hash算法 摘要算法 （md5无法反解）

// 1. md5：
// 不可逆
// 相同的内容摘要出的结果相同
// 摘要的内容不同 结果完全不同
// 摘要不同的内容，长度时相同的

const crypto = require('crypto');
// crypto.createHash创建一个摘要算法
// 逻辑运算：md5 , 把abc进行摘要，摘要的结果是base64 或 16进制。update('abc')摘要的内容，digest('base64')摘要的个数
let r1 = crypto.createHash('md5').update('abc').digest('base64');
console.log(r1);
// 可以多次update，多次摘要       
let r2 = crypto.createHash('md5').update('a').update('b').update('c').digest('base64');
console.log(r2); // r1等于r2

// 2.加盐算法（盐值sha256, 秘钥zf1）
let r3 = crypto.createHmac('sha256', 'zf1').update('abc').digest('base64');
console.log(r3)