const pluralize = require('pluralize')

const createFileWithContent = require('./createFileAndAddContent');

module.exports.createControllerAndService = (fileDirectory, resource) => {
    createFileWithContent.createFileWithContent(`${fileDirectory}/controller/${resource}Controller.js`, 
        require('../code-snippets/controllerSchema')(resource, pluralize(resource)))
    createFileWithContent.createFileWithContent(`${fileDirectory}/service/${resource}Service.js`, 
        require('../code-snippets/serviceSchema')(resource))
}