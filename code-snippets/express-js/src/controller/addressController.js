import {Router} from 'express';
import addressService from '../service/addressService';

const addresses = Router();

addresses.get('/', addressService.all);
addresses.get('/:addressId', addressService.single);

export default addresses;