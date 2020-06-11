module.exports = (resource) => `import {Request, Response} from 'express';
import {validationResult, Result, ValidationError} from 'express-validator';

export default {
    single: (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const ${resource}: any = req.params.${resource}Id;
        return res.status(200).json({ ${resource} });
    },
    all: (req: Request, res: Response) => {
        return res.status(200).json([{ ${resource}: "New York" },{ ${resource}: "Chicago" }]);
    }
};`