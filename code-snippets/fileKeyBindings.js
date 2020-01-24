const pluralize = require('pluralize')

module.exports = {
    'routes/index.js': require('./route.js'),
    'controller/userController.js': require('./controllerSchema')('user', pluralize('user')),
    'controller/addressController.js': require('./controllerSchema')('address', pluralize('address')),
    'service/userService.js': require('./serviceSchema')('user'),
    'service/addressService.js': require('./serviceSchema')('address')
}