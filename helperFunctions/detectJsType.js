const { join } = require('path');
const { readFile } = require('fs');
const { jsType } = require('./jsTypes')

module.exports = (folderDirectory) => {
    return new Promise((resolve, reject) => {
        readFile(join(folderDirectory, 'package.json'), 'utf8', (err, content) => {
            if(err){
                console.log('Please the directory correctly, as package.json is missing')
            } else {
                content = JSON.parse(content).dependencies;
                if (content.hasOwnProperty('@types/express')) {
                    resolve(jsType.TS)
                } else if (content.hasOwnProperty('express')) {
                    resolve(jsType.JS)
                }
            }
        })
    })
}