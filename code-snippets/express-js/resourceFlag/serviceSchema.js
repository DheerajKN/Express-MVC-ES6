module.exports = (resource) => `import {validationResult} from 'express-validator';
export default {
    single: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
        }
        const ${resource} = req.params.${resource}Id;
        res.status(200).json({ ${resource} });
    },
    all: (req, res) => {
        res.status(200).json([{ ${resource}: "New York" },{ ${resource}: "Chicago" }]);
    }
};`