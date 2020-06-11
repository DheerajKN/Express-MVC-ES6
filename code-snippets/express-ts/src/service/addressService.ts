import {Request, Response} from 'express';
import {validationResult, ValidationError, Result} from 'express-validator';
export default {
    single: (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const address: any = req.params.addressId;
        return res.status(200).json({ address });
    },
    all: (req: Request, res: Response) => {
        return res.status(200).json([{ address: "New York" },{ address: "Chicago" }]);
    }
};