const url = require('url')

const request = {
  get url() { // Object.defineProperty的简写，属性访问器
    // ctx.request.url -> this指向ctx.request。在createContent中我们已经默认设置
    // ctx.request.req = 原生req了，所以这里可以通过this.req.url取得url
    return this.req.url;
  },

  get path() {
    return url.parse(this.req.url).pathname
  },

  get query() {
    return url.parse(this.req.url).query;
  }

}
module.exports = request;