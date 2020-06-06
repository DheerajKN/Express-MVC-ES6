module.exports = `import {Router} from 'express';

const routes = Router()

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

import users from '../controller/userController';
routes.use('/users', users);

import addresses from '../controller/addressController';
routes.use('/addresses', addresses);

export default routes;
`