var a = 100;
console.log('a exec');
console.log(this === module.exports);// true
module.exports = a