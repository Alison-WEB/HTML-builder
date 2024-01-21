const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, 'utf-8');

console.log('Hello, write your text here:');
process.stdin.on('data', data => {
  const input = data.toString().trim();
  if (input === 'exit') {
    writeStream.end();
    console.log('Text entered has been saved to text.txt');
    process.exit();
  } else {
    writeStream.write(data);
  }
}); 

process.on('SIGINT', () => {
  writeStream.end();
  console.log('Text entered has been saved to text.txt');
  process.exit();
});
