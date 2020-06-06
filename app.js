#!/usr/bin/env node
const mkdirp = require('mkdirp');
const shell = require('shelljs');
const fs = require('fs');
const arguements = require('minimist')

let appDirectory = `${process.cwd()}`

const mainContentBindings = require('./code-snippets/fileKeyBindings');
const createFileWithContent = require('./helperFunctions/createFileAndAddContent');
const getFileAndUpdateContent = require('./helperFunctions/getFileAndUpdateContent');
const createControllerAndService = require('./helperFunctions/createControllerAndService');
const styling = require('./code-snippets/styling')
const viewComponent = require('./code-snippets/view')
const authComponent = require('./code-snippets/authComponent.js')
const dbComponent = require('./code-snippets/dbComponent.js')
const { join, sep } = require('path');
const { readFile } = require('fs');

const cdIntoApp = () => {
    return new Promise(resolve => {
        shell.cd(appDirectory)
        resolve()
    })
}

const attachStartScript = (folderDirectory) => {
    let packageFile = join(folderDirectory, 'package.json');
    try {
        if (fs.existsSync(packageFile)) {
            fs.readFile(packageFile, 'utf8', (err, oldContent) => {
                let newContent = oldContent.replace(/"scripts": {/g, `"scripts": {\n    "start": "nodemon --exec babel-node app.js",`);
                fs.writeFile(packageFile, newContent, (err) => {
                    if (err) throw err;
                })
            })
        }
    } catch (err) {
        console.log('package error add start: "nodemon --exec babel-node app.js" manually')
    }
}

const installPackages = (folderName, callback) => {
    return new Promise(resolve => {
        console.log("\nInstalling express, babel to provide es7 context\n")
        shell.exec(`npm init -y && npm install express && npm install -D nodemon @babel/core @babel/cli @babel/preset-env @babel/node`, () => {
            attachStartScript(folderName)
            console.log("\nFinished installing packages\n")
            console.log(`cd into ${folderName} and use futher commands like 
        1) --resource=phone to further orchestrate controller and service file with mapping of route.js,
        2) --db to add mongo setup code along with User Entity and dependencies,
        3) --db --auth for JWT setup code along with supporting User Entity`)
            resolve()
            callback()
        })
    })
}

const defaultRun = () => {
    return new Promise(resolve => {
        let promises = []
        createFileWithContent.createFileWithContent(`${appDirectory}/app.js`, require('./code-snippets/app'));

        Object.keys(mainContentBindings).forEach((fileName, i) => {
            promises[i] = new Promise(res => {
                createFileWithContent.createFileWithContent(`${appDirectory}/src/${fileName}`, mainContentBindings[fileName], err => {
                    if (err) { return console.log(err) }
                    res()
                });
            })
        })
        Promise.all(promises).then(() => { resolve() })
    })
}

const addRoute = (resource) => {
    getFileAndUpdateContent.updateRouteText(`${appDirectory}/src/routes/index.js`, resource)
        .then(() => createControllerAndService.createControllerAndService(`${appDirectory}/src`, resource))
        .catch((err) => console.log(err));
}

let arguement = arguements(process.argv.slice(2));

if (Object.keys(arguement).some(r => ["resource", "db", "auth"].includes(r))) {
    readFile(join(appDirectory, 'package.json'), 'utf8', (err, _) => {
        if(err) 
            console.log('Package.json is missing make sure that your inside project directory to execute this command')
        else if (arguement.hasOwnProperty('resource')) {
            addRoute(arguement.resource)
        } else if (arguement.hasOwnProperty('db')) {
            dbComponent.addDBComponent(appDirectory, process.cwd().split(sep).pop())
            if (arguement.hasOwnProperty('auth')) {
                authComponent.addAuthComponent(appDirectory)
            }
        }
    });
}
else {
    let folderName = arguement._[0];
    appDirectory = join(appDirectory, folderName);
    mkdirp(appDirectory);
    cdIntoApp()
    installPackages(appDirectory, () => shell.exec('npm i'))
    createFileWithContent.createFileWithContent(join(appDirectory, '.babelrc'), '{  "presets": ["@babel/preset-env"]  }')
    defaultRun()
    if (arguement.hasOwnProperty('style')) {
        styling.addStylingToProject(arguement.style, appDirectory)
    }
    if (arguement.hasOwnProperty('view')) {
        viewComponent.addViewToProject(arguement.view, appDirectory)
    }
}
