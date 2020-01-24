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

const cdIntoApp = () => {
    return new Promise(resolve => {
        shell.cd(appDirectory)
        resolve()
    })
}

const attachStartScript = (folderDirectory) => {
    let packageFile = `${folderDirectory}/package.json`
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
        1) --resource=phone to further orchestrate controller and service file with mapping of route.js`)
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

if (arguement.hasOwnProperty('resource')) {
    addRoute(resource)
}
else {
    let folderName = arguement._[0];
    appDirectory += `/${folderName}`
    mkdirp(appDirectory);
    cdIntoApp()
    installPackages(appDirectory, () => shell.exec('npm i'))
    createFileWithContent.createFileWithContent(`${appDirectory}/.babelrc`, '{  "presets": ["@babel/preset-env"]  }')
    defaultRun()
    if (arguement.hasOwnProperty('style')) {
        styling.addStylingToProject(arguement.style, appDirectory)
    }
    if (arguement.hasOwnProperty('view')) {
        viewComponent.addViewToProject(arguement.view, appDirectory)
    }
}
