const fs = require('fs');
const path = require('path')

let appDirectory = path.resolve(__dirname + '/../'); 

module.exports.fetchContent = (filePath) => {
    return new Promise((resolve, reject)=>{
        fs.readFile(appDirectory+filePath, 'utf8', (err, oldContent)=>{
            if(err) reject(err)
            resolve(oldContent);
        })
    })
}