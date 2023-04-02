const fs = require('fs');
const util = require('util');
const read = util.promisify(fs.readFile);

let ejs = {
  async renderFile(filename, options) {
    let content = await read(filename, 'utf-8');
    content = content.replace(/<%=(.+?)%>/g, function (_, $1) {
      return '${' + $1 + '}';
    })
    let head = 'let str = "";\nwith(obj){\n str+= `';

    let body = content.replace(/<%(.+?)%>/g, function (_, $1) {
      return '`\n' + $1 + '\nstr+=`';
    });

    let tail = '`} return str;';

    let fn = new Function('obj', head + body + tail);
    return fn(options);
  }
};
(async function () {
  let r = ejs.renderFile('template.html', { arr: [1, 2, 3] });
  r.then(res => {
    console.log(res)
  })
})()