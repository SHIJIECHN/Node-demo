// 前端优化方案：缓存、压缩
const zlib = require('zlib');

// 读一点文件就gzip一下，再把内容写会去
// webpack来做、服务端可以做gzip
// gzip不适合重复率的低的内容，gzip核心就是相同替换的方案
zlib.gzip('abc', function (err, data) {
  console.log(data);
})