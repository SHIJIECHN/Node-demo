#! /usr/bin/env node



// 这里需要有一个帮助文档 命令行帮助

const program = require('commander');
const options = require('./config');
program.name('fs')
program.usage('[options]');

const examples = new Set()
const defaultMapping = {};
Object.entries(options).forEach(([key, value]) => {
  examples.add(value.usage);
  defaultMapping[key] = value.default;
  program.option(value.option, value.description)
})

program.on('--help', function () {
  console.log('\nExamples: ');
  examples.forEach(item => {
    console.log(` ${item}`)
  })
})

// 解析当前运行进程传递的参数
program.parse(process.argv);

let userArgs = program.opts();
// 合并参数
let serverOptions = Object.assign(defaultMapping, userArgs);

// 启动服务
const Server = require('../src/index.js');
console.log('========================')
console.log(serverOptions)
let server = new Server(serverOptions);
server.start();

