const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'secret-folder');

function getFiles() {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file) => {
      fs.stat(path.join(filePath, file), (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          if (stats.isDirectory()) {
            console.log(file, '- is directory');
          } else {
            if (path.extname(file) !== '') {
              console.log(
                path.parse(file).name,
                '-',
                path.extname(file).slice(1),
                '-',
                parseFloat(stats.size / 1024).toFixed(2),
                'KB'
              );
            } else {
              console.log(
                '',
                '-',
                path.parse(file).name.slice(1),
                '-',
                parseFloat(stats.size / 1024).toFixed(2),
                'KB'
              );
            } 
          }
        }
      });
    });
  });
}
getFiles();
