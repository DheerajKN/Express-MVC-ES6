import {Router} from 'express';
import {param} from 'express-validator';

import userService from '../service/userService';

const users = Router();

users.get('/', userService.all);
users.get('/:userId', param(["userId"]).isInt({min:1}), userService.single);

export default users;