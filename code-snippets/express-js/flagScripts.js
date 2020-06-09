const {sep} = require('path');

const getFileAndUpdateContent = require('./resourceFlag/getFileAndUpdateContent');
const createControllerAndService = require('./resourceFlag/createControllerAndService');
const authComponent = require('./authComponent.js')
const dbComponent = require('./dbFlag/dbComponent.js')

module.exports.JSFlagScript = (arguement, appDirectory) => {
  if (arguement.hasOwnProperty('resource')) {
    getFileAndUpdateContent.updateRouteText(`${appDirectory}/src/routes/index.js`, arguement.resource)
      .then(() => createControllerAndService.createControllerAndService(`${appDirectory}/src`, arguement.resource))
      .catch((err) => console.log(err));
  } else if (arguement.hasOwnProperty('db')) {
      dbComponent.addDBComponent(arguement, appDirectory, process.cwd().split(sep).pop())
    if (arguement.hasOwnProperty('auth')) {
      authComponent.addAuthComponent(/^(mongo|true)$/.test(arguement.db) ? 'email' : 'where: { email }', appDirectory)
    }
  }
}