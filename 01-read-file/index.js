const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf-8');

readStream.on('data', (data) => {
  console.log(data);
});

readStream.on('end', () => {
  console.log('File reading completed.');
});

readStream.on('error', (err) => {
  console.error('An error occurred while reading the file:', err);
});