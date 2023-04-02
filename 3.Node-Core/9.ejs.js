// 主要通过new Function + with来实现的

// const ejs = require('ejs');
const fs = require('fs');
const util = require('util');
const read = util.promisify(fs.readFile);

let ejs = {
  async renderFile(filename, options) {
    let content = await read(filename, 'utf-8');
    content = content.replace(/<%=(.+?)%>/g, function (_, $1) {
      return options[$1]; // 获取对应的内容并替换
    })
    console.log(content);
  }
};

(async function () {
  let r = ejs.renderFile('template.html', { name: 'zf', age: 10 });
  // console.log(r);
})()
