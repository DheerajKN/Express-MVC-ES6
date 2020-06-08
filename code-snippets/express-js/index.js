const {exec, cp, mv} = require('shelljs');
const {join} = require('path');
const {existsSync, writeFile, readFile} = require('fs');

module.exports.initialJSSetup = (folderDirectory, folderName) => {
  //Install Dependencies
  exec(`npm install express && npm install -D nodemon @babel/core @babel/cli @babel/preset-env @babel/node && npm i`, () => {
    this.attachJSStartScript(folderDirectory)
    console.log("\nFinished installing packages\n")
    console.log(`cd into ${folderName} and use futher commands like 
1) --resource=phone to further orchestrate controller and service file with mapping of route.js,
2) --db to add mongo setup code along with User Entity and dependencies,
3) --db --auth for JWT setup code along with supporting User Entity`)
  })
  cp('-R', join(__dirname, 'src'), folderDirectory)
  
  const initialDirectory = join(folderDirectory, 'src');
  const finalSet = ['app.js'].map(file => join(initialDirectory, file))
  mv(finalSet, join(folderDirectory))
}
module.exports.attachJSStartScript = (folderDirectory) => {
  let packageFile = join(folderDirectory, 'package.json');
  try {
    if (existsSync(packageFile)) {
          readFile(packageFile, 'utf8', (err, oldContent) => {
              let newContent = oldContent.replace(/"scripts": {/g, `"scripts": {\n    "start": "nodemon --exec babel-node app.js",`);
              writeFile(packageFile, newContent, (err) => {
                  if (err) throw err;
              })
          })
      }
  } catch (err) {
      console.log('package error add start: "nodemon --exec babel-node app.js" manually')
  }
}