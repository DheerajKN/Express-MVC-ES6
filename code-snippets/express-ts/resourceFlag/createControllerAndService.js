const pluralize = require('pluralize')

const {createFileWithContent} = require('../../../helperFunctions/createFileAndAddContent');

module.exports.createControllerAndService = (fileDirectory, resource) => {
    createFileWithContent(`${fileDirectory}/controller/${resource}Controller.ts`, 
        require('./controllerSchema')(resource, pluralize(resource)))
    createFileWithContent(`${fileDirectory}/service/${resource}Service.ts`, 
        require('./serviceSchema')(resource))
}