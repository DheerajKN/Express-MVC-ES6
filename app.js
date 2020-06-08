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
