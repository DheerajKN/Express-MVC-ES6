#!/usr/bin/env node
const { cd, exec } = require("shelljs");
const mkdirp = require("mkdirp");
const { join, sep } = require("path");
const arguements = require("minimist");

const detectJsType = require('./helperFunctions/detectJsType')
const {jsType} = require('./helperFunctions/jsTypes')

const createFileWithContent = require('./helperFunctions/createFileAndAddContent');
const styling = require('./code-snippets/styling')
const viewComponent = require('./code-snippets/view')
const {initialJSSetup} = require('./code-snippets/express-js/index')
const getFileAndUpdateContent = require('./code-snippets/express-js/getFileAndUpdateContent');
const createControllerAndService = require('./code-snippets/express-js/createControllerAndService');
const authComponent = require('./code-snippets/express-js/authComponent.js')
const dbComponent = require('./code-snippets/express-js/dbComponent.js')

let appDirectory = `${process.cwd()}`;

let arguement = arguements(process.argv.slice(2));

const cdIntoApp = appDirectory => {
  return new Promise(resolve => {
    cd(appDirectory);
    resolve();
  });
};

if (Object.keys(arguement).some(r => ["resource", "db", "auth"].includes(r))) {
    detectJsType(appDirectory).then(type=>{
        if (type === jsType.TS) {
          //Activity as part of TS Support      
        } else if(type === jsType.JS){
          if (arguement.hasOwnProperty('resource')) {
            getFileAndUpdateContent.updateRouteText(`${appDirectory}/src/routes/index.js`, arguement.resource)
              .then(() => createControllerAndService.createControllerAndService(`${appDirectory}/src`, arguement.resource))
              .catch((err) => console.log(err));
          } else if (arguement.hasOwnProperty('db')) {
              dbComponent.addDBComponent(appDirectory, process.cwd().split(sep).pop())
            if (arguement.hasOwnProperty('auth')) {
              authComponent.addAuthComponent(appDirectory)
            }
          }
        }
    })
}
else if (arguement._[0] !== undefined) {
  let folderName = arguement._[0];
  appDirectory = join(appDirectory, folderName);
  mkdirp.sync(appDirectory);
  cdIntoApp(appDirectory);
  exec('npm init -y')
  const fileType = arguement.hasOwnProperty('typescript') ? jsType.TS : jsType.JS;
  if(jsType.TS === fileType){
    //link ts folder index.js as part of TS Support Activity
  }else{
    createFileWithContent.createFileWithContent(join(appDirectory, '.babelrc'), '{  "presets": ["@babel/preset-env"]  }')
    initialJSSetup(appDirectory, folderName)
  }
  if (arguement.hasOwnProperty('style')) {
    styling.addStylingToProject(arguement.style, appDirectory, fileType)
  }
  if (arguement.hasOwnProperty('view')) {
    viewComponent.addViewToProject(arguement.view, appDirectory, fileType)
  }
} else {
  console.log('Please Add project name as an arguement')
}
