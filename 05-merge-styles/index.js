const fs = require('node:fs');
const path = require('node:path');
const pathStyles = path.join(__dirname, 'styles');
const pathProjectDist = path.join(__dirname, 'project-dist');

function mergeStyles() {
  fs.promises.readdir(pathStyles, { withFileTypes: true }).then((files) => {
    const cssPromises = files
      .filter((file) => file.isFile() && file.name.endsWith('.css'))
      .map((file) =>
        fs.promises.readFile(path.join(pathStyles, file.name), 'utf-8')
      );
    Promise.all(cssPromises)
      .then((cssContent) => {
        const mergedCss = cssContent.join('\n');
        fs.promises
          .writeFile(
            path.join(pathProjectDist, 'bundle.css'),
            mergedCss,
            'utf-8')
          .then(() => {
            console.log('The css merge was successful.');
          })
          .catch((error) => {
            console.error('The css merge has failed.', error);
          });
      })
      .catch((error) => {
        console.error('The reading of files has failed.', error);
      });
  });
}

mergeStyles();
