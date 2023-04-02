// const fs = require('fs');

/**
创建目录：
1. fs.mkdirSync fs.mkdir 目录创建是一层一层的创建
2. 多层级目录创建，fs.mkdir不支持不层级目录创建
3. fs.stat()可以用于描述文件的状态，如果不存在文件或文件夹就发生错误。fs.existsSync是同步的，异步的被废弃了
 */

// fs.mkdir('a', function (err) {
//   if (err) return console.log(err);
//   console.log('创建成功')
// })

// fs.mkdir('a/b/c/d', function (err) {
//   if (err) return console.log(err);
//   console.log('创建成功')
// })

// 异步递归创建目录
// const fs = require('fs');
// function mkdir(pathStr, cb) {
//   let pathList = pathStr.split('/');
//   let index = 1;

//   function make(err) { // co模型
//     if (err) return cb(err);
//     if (index === pathList.length + 1) return cb(err);
//     let currentPath = pathList.slice(0, index++).join('/'); // [a] [a,b]
//     fs.stat(currentPath, function (err) {
//       if (err) { // 文件夹不存在，就创建
//         fs.mkdir(currentPath, make);
//       } else {
//         // 文件夹存在
//         make()
//       }
//     });
//   }
//   make();
// }

// mkdir('a/b/c/d', function (err) {
//   if (err) return console.log(err);
//   console.log('创建成功')
// })

// const fs = require('fs').promises; // node 11 后可以直接 .promises
// const { existsSync } = require('fs');
// async function mkdir(pathStr) {
//   let pathList = pathStr.split('/');

//   // 循环路径
//   for (let i = 1; i <= pathList.length; i++) {
//     let currentPath = pathList.slice(0, i).join('/'); // 获取路径
//     if (!existsSync(currentPath)) { // 如果当前路径不存在
//       await fs.mkdir(currentPath); // 创建目录
//     }
//   }
// }

// mkdir('a/b/c/d').then(() => {
//   console.log('创建成功')
// }).catch(err => {
//   console.log(err)
// })


// 删除
// fs.rmdir  fs.rmdirSync
// fs.readdir 查看目录中的儿子列表，数组
const fs = require('fs');
// fs.rmdir('a', function (err) {
//   console.log(err);
// })

fs.readdir('a', function (err, dirs) {
  console.log(dirs)
})