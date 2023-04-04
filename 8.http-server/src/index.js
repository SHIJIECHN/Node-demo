const http = require('http');
const url = require('url'); // url处理
const chalk = require('chalk'); // 输出命令颜色
const path = require('path');
const fs = require('fs').promises; // 将fs中所有的方法变成promise
const mime = require('mime');// 通过文件返回文件类型
const { createReadStream, readFileSync } = require('fs');
const ejs = require('ejs'); // 解析模板
const zlib = require('zlib'); // 压缩

const template = readFileSync(path.resolve(__dirname, 'template.html'), 'utf8');

class Server {
  constructor(serverOptions) {
    this.port = serverOptions.port;
    this.directory = serverOptions.directory;
    this.cache = serverOptions.cache;
    this.gzip = serverOptions.gzip;
    this.handleRequest = this.handleRequest.bind(this);  // 注意这里需要绑定this，不然函数拿不到this
    this.template = template; // 合适使用 不会导致重名
  }

  // 查看是目录还是文件，目录就列举文件，文件就读取文件内容
  async handleRequest(req, res) {
    // 1.获取请求路径 以当前目录为基准 查找文件，如果文件存在不是文件夹直接返回
    let { pathname } = url.parse(req.url); // 获取解析的路径
    pathname = decodeURIComponent(pathname); // 处理中文路径，遇到中文路径需要转码
    let requestFile = path.join(this.directory, pathname); // 拿到文件
    try {
      let statObj = await fs.stat(requestFile)
      if (statObj.isDirectory()) {
        // 目录
        const dirs = await fs.readdir(requestFile);
        // 根据数据和模板，渲染页面
        let fileContent = await ejs.render(this.template, {
          dirs: dirs.map(dir => ({
            name: dir,
            url: path.join(pathname, dir)
          }))
        });
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(fileContent);
      } else {
        // 文件。读取文件内容并返回
        this.sendFile(req, res, requestFile, statObj);
      }
    } catch (e) {
      this.sendError(req, res, e);
    }
  }

  cacheFile() {

  }

  gzipFile(req, res, requestFile, statObj) { // 浏览器会给我一个accept-encoding的字段，我要看一下浏览器支持什么压缩
    let encodings = req.headers['accept-encoding'];
    console.log(encodings)
    if (encodings) { // 浏览器支持
      if (encodings.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip'); // 浏览器要知道服务器的压缩类型
        return zlib.createGzip();
      } else if (encodings.includes('deflate')) {
        res.setHeader('Content-Encoding', 'deflate');
        return zlib.createDeflate();
      }
    }
    return false;// 浏览器不支持压缩
  }

  sendFile(req, res, requestFile, statObj) {
    // 读取文件的时候判断是否有缓存，如果有缓存则直接从缓存中读取并返回
    // if (this.cacheFile()) {

    // }

    // 我们返回文件，需要给浏览器提供内容类型和内容的编码格式
    res.setHeader('Content-Type', mime.getType(requestFile) + ';charset=utf-8');
    // 需要将文件读取出来并且返回
    // createReadStream(requestFile).pipe(res);

    let createGzip = this.gzipFile(req, res, requestFile, statObj);
    if (createGzip) { // 看一下支不支持压缩，如果支持，就返回一个压缩流
      return createReadStream(requestFile).pipe(createGzip).pipe(res); // 转化流
    }

    createReadStream(requestFile).pipe(res);
  }

  sendError(req, res, e) {
    res.statusCode = 404;
    res.end('Not Found');
  }

  start() {
    // 启动服务，监听端口是否占用，占用端口加1
    const server = http.createServer(this.handleRequest);// 使handleRequest方法中的this指向实例

    server.listen(this.port, () => { // 订阅方法，监听成功后触发
      console.log(chalk.yellow('Available on:'))
      console.log(chalk.green(`http://10.246.40.134:${this.port}`));
      console.log(chalk.green(`http://127.0.0.1:${this.port}`));
      console.log(chalk.green(`http://172.18.9.49:${this.port}`));
    })

    server.on('error', (err) => {
      console.log(err);
      if (err.code == 'EADDRINUSE') {
        server.listen(++this.port);
      }
    })
  }
}
module.exports = Server;