#!/usr/bin/env node
const { cd, exec } = require("shelljs");
const mkdirp = require("mkdirp");
const { join } = require("path");
const arguements = require("minimist");

const detectJsType = require('./helperFunctions/detectJsType')
const {jsType} = require('./helperFunctions/jsTypes')

const {createFileWithContent} = require('./helperFunctions/createFileAndAddContent');
const styling = require('./code-snippets/styling')
const viewComponent = require('./code-snippets/view')
const {initialJSSetup} = require('./code-snippets/express-js/index')
const {initialTSSetup} = require('./code-snippets/express-ts/index')
const {JSFlagScript} = require('./code-snippets/express-js/flagScripts');
const {TSFlagScript} = require('./code-snippets/express-ts/flagScripts');

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
          TSFlagScript(arguement, appDirectory);
        } else if(type === jsType.JS){
          console.log('entered')
          JSFlagScript(arguement, appDirectory);
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
    initialTSSetup(appDirectory, folderName)
  }else{
    createFileWithContent(join(appDirectory, '.babelrc'), '{  "presets": ["@babel/preset-env"]  }')
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
