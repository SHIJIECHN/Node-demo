## 多线程
- 优点：可以同时处理多个请求， 适合cpu密集型 （运算）
- 缺点：如果多个线程操作同一个资源得上锁
- 群发短信  多线程并不是一起去干一些事，而是靠的是切换上下文 （浪费一些性能）

> tomcat是多进程

## 单线程优点
- 不需要开启多个线程 节省资源，不适合做大量cpu操作。 开启子进程



global 上有属性直接访问的叫全局属性
require exports module也可以直接访问，它们不在global上
每个文件都是一个模块，模块化的实现借助的是函数
函数中有参数，参数里面有五个属性 ___driname __filename require exports module

console.log(exports);

为什么要有模块化？
模块化规范：commonjs规范 amd cmd esm模块 umd
为了解决命名冲突问题 （单例模式不能完全解决这些问题）
前端里会有 请求的问题 依赖问题 （amd cmd）

umd兼容 amd 、 cmd、commonjs 不支持es6模块

commonjs 规范  esModule模块

CommonJS规范（基于文件读写的，如果依赖了某个文件我会进行文件读写）
一个文件就是一个模块，我想使用这个模块就require，想给别人用就module.exports导出

exModule规范（每次引用一个模块，非请求，静态的 靠webpack编译
es6中 一个文件一个模块，别人想用我 就需要export 我想用别人 我就import

不允许
if (true) {
  import xxx from './xxx'
}

允许
if (true) {
  require('./xxx')
}

## module

node中的模块 es6Module CommonJS规范 两种规范。用webpack打包后esModule转成CommonJS模块。

- es6 “静态”模块（tree-shaking）可以在编译的时候进行Fenix
- CommonJS “动态”模块 在代码执行的时候引入模块（无法做tree-shaking）

CommonJS模块规范
1. 每个文件都是一个模块（每个文件外面都有一个函数）
2. 文件需要被别人所使用的，需要导出 module.exports = xxx
3. 如果需要使用别人的模块，需要require

模块的分类：
1. 核心模块、内置模块（node中自带的模块 fs http...）
2. 第三方模块
3. 文件模块，别人引用的时候需要通过相对路径或者绝对路径引用

fs是内置模块。
```javascript
const fs = require('fs'); // require内部就是使用readFIleAsync来实现的

// 读取文件如果文件不存在会发生异常
let r = fs.readFileSync('./a.txt', 'utf-8');
let exist = fs.existsSync('./a.txt');
console.log(exist);// true
```
什么时候用同步？什么时候用异步？

当代码已经在运行状态下，尽量少使用同步（会阻塞）。


