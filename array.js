var fs = require("fs");
var text = fs.readFileSync("./mytxt.txt").toString('utf-8');
var textByLine = text.split("\n")
console.log(textByLine)

