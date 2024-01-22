const fs = require('node:fs');
const path = require('node:path');
const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

function copyFiles() {
  fs.rm(filesCopyPath, { recursive: true, force: true }, function () {
    fs.mkdir(filesCopyPath, { recursive: true }, function () {
      fs.promises.readdir(filesPath, { withFileTypes: true }).then((files) => {
        files.forEach((file) => {
          fs.promises
            .copyFile(
              path.join(filesPath, file.name),
              path.join(filesCopyPath, file.name))
            .then(() => {
              console.log(`File ${file.name} copied successfully.`);
            })
            .catch((err) => {
              console.log(
                `!!!\nPlease make sure there are no subfolders in the 'files' folder.\nError copying file ${file.name}:\n${err}
              `);
            });
        })
      })
    })
  }
)}

copyFiles();