const context = {
}

function defineGetter(target, key) { // proxy 也可以使用
  context.__defineGetter__(key, function () {
    return this[target][key];
    // 这个this是：调用这个key的对象。如ctx.request.url，this就是ctx.request。
    // 这个ctx是经过包装过的，和这里的context不相等
  })
}

function defineSetter(target, key) {
  context.__defineSetter__(key, function (value) {
    this[target][key] = value; // ctx.body = ctx.reponse.body = value
  })
}

defineGetter('request', 'query');
defineGetter('request', 'url');
defineGetter('request', 'path');
defineGetter('response', 'body');

defineSetter('response', 'body');


module.exports = context;