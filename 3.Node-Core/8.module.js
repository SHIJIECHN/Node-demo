// 文件模块的查找
/**
 * 判断路径是不是核心模块，是核心模块就不会做下面的事了，看下是不是第三方，如果不是在继续下面步骤：
 * 1. 最新版本Node 默认先查找同名文件，如果没找到尝试添加查找.js和.json文件
 * 2. 如果没有，就查找到同名文件夹（当成一个包），先查找package.json
 * 3. 如果没有就找文件夹中的index.js，如果还没有就报错
 */


let a = require('./jquery');
console.log(a)

// 第三方模块（引用没有相对路径）
/**
 * 模块分为：1. 全局模块。2. 代码中的第三方模块。
 * 
 * 代码中的第三方：
 * 1. 默认会沿着当前目录向上查找，查找node_modules下的同名文件，
 * 根据package.json中的main，如果没有对应文件，就查找index.json。
 * 2. 如果没找到，就向上找，找上级的node_modules，如果到根路径了还没有找到，就报错了
 * 
 * 全局模块：安装到电脑中的npm（node package manager）。
 * 第一种：全局安装只能在命令行里用。自己实现全局包：
 * 1. 需要配置bin命令
 * 2. 添加执行命令 #! /user/bin/env node
 * 3. 将次包放到npm下（可以全局安装）临时做一个npm link
 * 
 * 工具类的使用全局包。
 * 
 * 第二种：本地安装，在代码中使用
 * 依赖关系：开发依赖、生成依赖、同等依赖、打包依赖、可选依赖
 */
let co = require('co');
console.log(co);

/**
 * 第三方模块写法：
 * 1. 创建global_module文件夹
 * 2. npm init -y 创建package.json
 * 3. 创建bin文件夹，创建bin/www.js 
 * 4. 修改package.json，添加字符段：
 * "bin": {
 *    "gm": "./bin/www"
 * }
 * 5. 在global_module下执行命令npm link，就是将当前文件link到node_modules下
 * 6. 修改www文件，添加类型： #! /user/bin/env node
 * 7. 命令行中输入gm
 */