import {validationResult} from 'express-validator';
export default {
    single: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const user = req.params.userId;
        return res.status(200).json({ user });
    },
    all: (req, res) => {
        return res.status(200).json([{ user: "New York" },{ user: "Chicago" }]);
    }
};