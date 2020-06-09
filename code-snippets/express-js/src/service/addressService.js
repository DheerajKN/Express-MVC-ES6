import {validationResult} from 'express-validator';
export default {
    single: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const address = req.params.addressId;
        return res.status(200).json({ address });
    },
    all: (req, res) => {
        return res.status(200).json([{ address: "New York" },{ address: "Chicago" }]);
    }
};