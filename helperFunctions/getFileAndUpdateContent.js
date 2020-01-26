const fs = require('fs');
const pluralize = require('pluralize')

const createFileWithContent = require('./createFileAndAddContent');

module.exports.updateRouteText = (filePath, resource) => {
    return new Promise((resolve, reject) => {
        const pluralizedResource = resource === 'auth' ? 'authentication' : pluralize(resource);
        try {
            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, 'utf8', (err, oldContent) => {
                    let newContent = oldContent.replace(/module.exports(.*)/g, `import ${pluralizedResource} from '../controller/${resource}Controller';
routes.use('/${pluralizedResource}', ${pluralizedResource});

module.exports = routes;`);

                    createFileWithContent.createFileWithContent(filePath, newContent, err => {
                        if (err) { console.log('Error in adding data to routes file') }
                    })
                })
                resolve()
            }
            else {
                throw 'routes/index.js file doesn\'t exists'
            }
        } catch (err) {
            reject(err)
        }
    })
}