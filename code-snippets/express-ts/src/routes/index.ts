import {Router, Request, Response} from 'express';

const routes: Router = Router()

routes.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Connected!' });
});

import users from '../controller/userController';
routes.use('/users', users);

import addresses from '../controller/addressController';
routes.use('/addresses', addresses);

export default routes;
