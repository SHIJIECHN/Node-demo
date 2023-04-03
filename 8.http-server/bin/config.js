const options = {
  'port': {
    option: '-p, --port <n>', // 根据commander的option('')
    default: 8080,
    usage: 'fs --port 3000',
    description: 'set fs port',
  },
  'gzip': {
    option: '-g, --gzip <n>',
    default: 1,
    usage: 'fs --gzip 0', // 禁用压缩
    description: 'set fs gzip'
  },
  'cache': {
    option: '-c, --cache <n>',
    default: 1,
    usage: 'fs --cache 0', // 禁用缓存
    description: 'set fs cache'
  },
  'directory': {
    option: '-d, --directory <n>',
    default: process.cwd(),
    usage: 'fs --directory d:', // 
    description: 'set fs directory'
  }
}

module.exports = options;