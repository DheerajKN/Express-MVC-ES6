#!/usr/bin/env node
const { cd, exec } = require("shelljs");
const mkdirp = require("mkdirp");
const { join } = require("path");
const arguements = require("minimist");

const detectJsType = require('./helperFunctions/detectJsType')
const {jsType} = require('./helperFunctions/jsTypes')

const createFileWithContent = require('./helperFunctions/createFileAndAddContent');
const styling = require('./code-snippets/styling')
const viewComponent = require('./code-snippets/view')
const {initialJSSetup} = require('./code-snippets/express-js/index')

let appDirectory = `${process.cwd()}`;

let arguement = arguements(process.argv.slice(2));


const cdIntoApp = appDirectory => {
  return new Promise(resolve => {
    cd(appDirectory);
    resolve();
  });
};

if (Object.keys(arguement).some(r => ["resource", "db", "auth"].includes(r))) {
    //Activity 2
    detectJsType(appDirectory).then(type=>{
        if (type === jsType.TS) {
            
        } else if(type === jsType.JS){
            
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
    //link ts folder index.js
  }else{
    createFileWithContent.createFileWithContent(join(appDirectory, '.babelrc'), '{  "presets": ["@babel/preset-env"]  }')
    initialJSSetup(appDirectory, folderName)
  }
  //Standard linking of style and view but need to pass filetype for linkage
  if (arguement.hasOwnProperty('style')) {
    styling.addStylingToProject(arguement.style, appDirectory, fileType)
  }
  if (arguement.hasOwnProperty('view')) {
    viewComponent.addViewToProject(arguement.view, appDirectory, fileType)
  }
} else {
  console.log('Please Add project name as an arguement')
}
