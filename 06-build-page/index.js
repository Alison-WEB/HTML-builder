const fs = require('node:fs');
const path = require('node:path');
const pathStyles = path.join(__dirname, 'styles');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathAssets = path.join(__dirname, 'assets');
const pathProjectDistAccets = path.join(pathProjectDist, 'assets');
const pathTemplate = path.join(__dirname, 'template.html');
const pathComponents = path.join(__dirname, 'components');
const headerPath = path.join(pathComponents, 'header.html');
const footerPath = path.join(pathComponents, 'footer.html');
const articlesPath = path.join(pathComponents, 'articles.html');
// const aboutPath = path.join(pathComponents, 'about.html');
// console.log(pathTemplate);

function bundlePage() {
  fs.rm(pathProjectDist, { recursive: true, force: true }, function () {
    fs.mkdir(pathProjectDist, { recursive: true }, function () {
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
                path.join(pathProjectDist, 'style.css'),
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
      copyFilesRecursive(pathAssets, pathProjectDistAccets);
      insertIntoTemplate();
    })
  })
}

bundlePage();

function copyFilesRecursive(sourcePath, destinationPath) {
  fs.promises.readdir(sourcePath, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      const sourceFilePath = path.join(sourcePath, file.name);
      const destinationFilePath = path.join(destinationPath, file.name);
      fs.promises.stat(sourceFilePath).then((stats) => {
        if (stats.isFile()) {
          fs.promises
            .copyFile(sourceFilePath, destinationFilePath)
            .then(() => {
              console.log(`File ${file.name} copied successfully.`);
            })
            .catch((err) => {
              console.log(`Error copying file ${file.name}:\n${err}`);
            });
        } else if (stats.isDirectory()) {
          fs.mkdir(destinationFilePath, { recursive: true }, function () {
            copyFilesRecursive(sourceFilePath, destinationFilePath);
          });
        }
      });
    });
  });
}

function insertIntoTemplate() {
  fs.promises.readFile(pathTemplate, 'utf-8').then((templateContent) => {
    Promise.all([
      fs.promises.readFile(headerPath, 'utf-8'),
      fs.promises.readFile(footerPath, 'utf-8'),
      fs.promises.readFile(articlesPath, 'utf-8')
    ]).then(([headerContent, footerContent, articlesContent, aboutContent]) => {
      const updatedTemplate = templateContent
        .replace('{{header}}', headerContent)
        .replace('{{footer}}', footerContent)
        .replace('{{articles}}', articlesContent);
      fs.promises.writeFile(pathTemplate, updatedTemplate, 'utf-8')
        .then(() => {
          console.log('Inserting components into the template was successful');
        })
        .catch((error) => {
          console.error('Error when inserting components into a template.', error);
        });
    }).catch((error) => {
      console.error('Error reading components.', error);
    });
  }).catch((error) => {
    console.error('Error reading components.', error);
  });
}