## express和koa的对比
- express的源码是ES5写的，koa源码是基于ES6写的
- express比较全内置了很多功能，koa内部核心是非常小的，但是我们可以通过扩展的插件进行扩展
- express和koa都是可以自己去使用来实现MVC功能的，没有约束
- express处理异步的方式都是回调函数，koa处理异步的方式都是async+await