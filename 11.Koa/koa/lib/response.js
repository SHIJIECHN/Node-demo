const response = {
  _body: undefined,
  get body() { // 调用 ctx.response.body => this就是ctx.response，ctx.response.res=res
    return this._body;
  },

  set body(value) {
    this.res.statusCode = 200; // 如果用户调用了ctx.body = 'xxx' 此时修改状态码为200
    this._body = value
  }
}


module.exports = response;