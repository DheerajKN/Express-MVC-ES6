import {validationResult} from 'express-validator';
export default {
    single: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
        }
        const address = req.params.addressId;
        res.status(200).json({ address });
    },
    all: (req, res) => {
        res.status(200).json([{ address: "New York" },{ address: "Chicago" }]);
    }
};