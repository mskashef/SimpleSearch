var fs = require('fs');
var contents = fs.readFileSync('file.txt', 'utf8');
console.log(contents);