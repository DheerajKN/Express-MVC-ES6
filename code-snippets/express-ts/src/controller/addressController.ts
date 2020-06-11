import {Router} from 'express';
import {param} from 'express-validator';

import addressService from '../service/addressService';

const addresses: Router = Router();

addresses.get('/', addressService.all);
addresses.get('/:addressId', param(["addressId"]).isInt({min:1}), addressService.single);

export default addresses;