import {Request, Response} from 'express';
import {validationResult, ValidationError, Result} from 'express-validator';
export default {
    single: (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const user: any = req.params.userId;
        return res.status(200).json({ user });
    },
    all: (req: Request, res: Response) => {
        return res.status(200).json([{ user: "New York" },{ user: "Chicago" }]);
    }
};