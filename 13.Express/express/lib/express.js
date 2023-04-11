
const Application = require('./application')
const Router = require('./router/index.js')

// 这个就是express对象
// 1) 实现当前的应用和创建应用分离
function createApplication() {
  // 需要将get和listen方法都放到原型上
  return new Application(); // 类的好处，方便扩展、继承、可以高内聚
}
createApplication.Router = Router;
module.exports = createApplication;