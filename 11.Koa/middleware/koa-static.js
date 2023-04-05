const path = require('path');
const fs = require('fs').promises;
const mime = require('mime');

function static(dirname) {
  return async (ctx, next) => {
    let filePath = path.join(dirname, ctx.path);
    // 如果文件路径不是文件的话就不能处理了，需要调用下一个中间件
    // 如果自己能处理，就不要向下处理了
    try {
      let statObj = await fs.stat(filePath);
      if (statObj.isDirectory()) {
        // 是文件夹，需要拼接路径 xx/xx/index.html
        filePath = path.join(filePath, 'index.html');
      }
      ctx.set('Content-Type', mime.getType(filePath) + ';charset=utf-8')
      ctx.body = await fs.readFile(filePath);// 读取文件
    } catch (e) {
      // 自己处理不了的向下执行
      await next();
    }
  }
}

module.exports = static;