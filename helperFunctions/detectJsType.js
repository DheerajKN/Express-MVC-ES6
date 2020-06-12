const { join } = require('path');
const { readFile } = require('fs');
const { jsType } = require('./jsTypes')

module.exports = (folderDirectory) => {
    return new Promise((resolve, reject) => {
        readFile(join(folderDirectory, 'package.json'), 'utf8', (err, content) => {
            if(err){
                console.log('Please check the directory correctly, as package.json is missing')
            } else {
                content = JSON.parse(content).devDependencies;
                if (content.hasOwnProperty('@types/express')) {
                    resolve(jsType.TS)
                } else {
                    resolve(jsType.JS)
                }
            }
        })
    })
}