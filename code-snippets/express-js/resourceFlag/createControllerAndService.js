const pluralize = require('pluralize')

const createFileWithContent = require('../../../helperFunctions/createFileAndAddContent');

module.exports.createControllerAndService = (fileDirectory, resource) => {
    createFileWithContent.createFileWithContent(`${fileDirectory}/controller/${resource}Controller.js`, 
        require('./controllerSchema')(resource, pluralize(resource)))
    createFileWithContent.createFileWithContent(`${fileDirectory}/service/${resource}Service.js`, 
        require('./serviceSchema')(resource))
}