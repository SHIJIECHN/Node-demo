const os = require('os');
let interface = os.networkInterfaces();
console.log(interface);
interface = Object.values(interface)
let ip = interface.find(item => {
  return item.family === 'IPv4' && item.cidr.startsWith('10.246')
})