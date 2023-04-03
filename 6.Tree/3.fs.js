// const fs = require('fs');

/**
创建目录：
1. fs.mkdirSync fs.mkdir 目录创建是一层一层的创建
2. 多层级目录创建，fs.mkdir不支持不层级目录创建
3. fs.stat()可以用于描述文件的状态，如果不存在文件或文件夹就发生错误。fs.existsSync是同步的，异步的被废弃了。

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
// function mkdir(dir, cb) {
//   let dir = dir.split('/');
//   let index = 1;

//   function make(err) { // co模型
//     if (err) return cb(err);
//     if (index === dir.length + 1) return cb(err);
//     let currentPath = dir.slice(0, index++).join('/'); // [a] [a,b]
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
// async function mkdir(dir) {
//   let dir = dir.split('/');

//   // 循环路径
//   for (let i = 1; i <= dir.length; i++) {
//     let currentPath = dir.slice(0, i).join('/'); // 获取路径
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


// 目录状态（isFile(), isDirectory()
// 4. fs.unlink 删除文件（fs.rename())
const fs = require('fs');
fs.rmdir('a', function (err) {
  console.log(err);
})

// fs.readdir('c', function (err, dirs) {
//   console.log(dirs)
// })

// fs.stat('c/a.js', function (err, statObj) {
//   if (statObj.isFile()) { // 如果是文件
//     fs.unlink('c/a.js', function (params) { });
//   }
// })

// 先序遍历，遇到节点就处理左边的
// 串行
// const fs = require('fs');
// const path = require('path');
// function rmdir(dir, cb) { // 写递归先不要考虑多层，先把两层处理完毕
//   fs.stat(dir, function (err, statObj) {
//     if (statObj.isDirectory()) {
//       fs.readdir(dir, function (err, dirs) { // dirs => [a.js, b]
//         dirs = dirs.map(item => path.join(dir, item)); // [ 'a\\a.js', 'a\\b' ]
//         // 把目录里面的拿出来，1个删除完毕后删除第二个
//         let index = 0;
//         function step() {
//           // 将儿子都删除完毕后，删除自己
//           if (index === dirs.length) return fs.rmdir(dir, cb);
//           //删除第一个成功后继续调用step继续删除，直到全部删除完毕后删除自己
//           rmdir(dirs[index++], step);
//         }
//         step();
//       })
//     } else {
//       // 如果是文件直接删除即可
//       fs.unlink(dir, cb);
//     }
//   })
// }
// 改写成async await

// 并发
// const fs = require('fs');
// const path = require('path');
// function rmdir(dir, cb) {
//   fs.stat(dir, function (err, statObj) {
//     if (statObj.isDirectory()) {
//       // 读目录
//       fs.readdir(dir, function (err, dirs) {
//         dirs = dirs.map(item => path.join(dir, item));
//         if (!dirs.length) {
//           // 当前目录什么都没有
//           return fs.rmdir(dir, cb);
//         }
//         let index = 0;
//         function done() {
//           //当index等于文件长度，说明已经遍历执行结束了，就删除目录
//           if (++index === dirs.length) {
//             return fs.rmdir(dir, cb);
//           }
//         }
//         for (let i = 0; i < dirs.length; i++) { // 遍历目录
//           rmdir(dirs[i], done); // 对目录中的文件分别执行
//         }
//       })
//     } else {
//       // 当前是文件
//       fs.unlink(dir, cb);
//     }
//   })
// }
// rmdir('a', function () {
//   console.log('删除成功')
// })

// async + await
// const fs = require('fs').promises;
// const path = require('path');
// async function rmdir(dir) { // 如果用async await 就按照同步的逻辑来写
//   let statObj = await fs.stat(dir);// 获取目录信息
//   if (statObj.isDirectory()) {
//     let dirs = await fs.readdir(dir);
//     // 对每个文件都执行rmdir
//     dirs = dirs.map(item => rmdir(path.join(dir, item),));
//     await Promise.all(dirs);// 所有文件都执行成功
//     await fs.rmdir(dir); // 删除自己
//   } else {
//     return fs.unlink(dir);// 删除文件
//   }

// }
// rmdir('a').then(() => {
//   console.log('删除成功')
// }).catch(e => {
//   console.log(e);
// })

// 串行广度遍历

const fs = require('fs').promises;
const path = require('path');
async function rmdir(dir) {
  let statObj = await fs.stat(dir);
  if (statObj.isDirectory()) {
    let stack = [dir]; // 先把根放入
    let index = 0; // 指针
    let currentNode; // 不停的移动指针
    while (currentNode = stack[index++]) {
      let statObj = await fs.stat(currentNode); // 看下指针指到的文件
      if (statObj.isDirectory()) { // 如果是一个目录，将子节点放到栈中
        let dirs = await fs.readdir(currentNode); // 读目录
        dirs = dirs.map(item => path.join(currentNode, item)); // 拼接路径
        stack = [...stack, ...dirs]; // [ 'a', 'a\\a.js', 'a\\b', 'a\\b\\c', 'a\\b\\c\\e' ]
      }
    }
    console.log(stack);
    let len = stack.length; // 倒序删除即可
    // while () {

    // }
  }
}
rmdir('a').then(() => {
  console.log('删除成功')
})