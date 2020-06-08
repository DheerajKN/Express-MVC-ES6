module.exports = (resource, pluralResource) => `import {Router} from 'express';
import {param} from 'express-validator';

import ${resource}Service from '../service/${resource}Service';

const ${pluralResource} = Router();

${pluralResource}.get('/', ${resource}Service.all);
${pluralResource}.get('/:${resource}Id', param(["${resource}Id"]).isInt({min:1}), ${resource}Service.single);

export default ${pluralResource};`