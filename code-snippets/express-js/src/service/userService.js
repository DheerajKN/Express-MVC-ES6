import {validationResult} from 'express-validator';
export default {
    single: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
        }
        const user = req.params.userId;
        res.status(200).json({ user });
    },
    all: (req, res) => {
        res.status(200).json([{ user: "New York" },{ user: "Chicago" }]);
    }
};