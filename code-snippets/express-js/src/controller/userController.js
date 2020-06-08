import {Router} from 'express';
import userService from '../service/userService';

const users = Router();

users.get('/', userService.all);
users.get('/:userId', userService.single);

export default users;