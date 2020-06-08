module.exports = (resource, pluralResource) => `import {Router} from 'express';
import ${resource}Service from '../service/${resource}Service';

const ${pluralResource} = Router();

${pluralResource}.get('/', ${resource}Service.all);
${pluralResource}.get('/:${resource}Id', ${resource}Service.single);

export default ${pluralResource};`