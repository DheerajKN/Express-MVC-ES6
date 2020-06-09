const pluralize = require('pluralize')

const {createFileWithContent} = require('../../../helperFunctions/createFileAndAddContent');

module.exports.createControllerAndService = (fileDirectory, resource) => {
    createFileWithContent(`${fileDirectory}/controller/${resource}Controller.js`, 
        require('./controllerSchema')(resource, pluralize(resource)))
    createFileWithContent(`${fileDirectory}/service/${resource}Service.js`, 
        require('./serviceSchema')(resource))
}