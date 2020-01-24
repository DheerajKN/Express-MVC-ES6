const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;

module.exports.createFileWithContent = (filePath, content) => {
    mkdirp(getDirName(filePath), function (err) {
        if (err) return cb(err);
        fs.writeFile(filePath, content, (err)=>{
            if (err) throw err;
        })
    })
}