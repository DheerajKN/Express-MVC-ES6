module.exports = (resource) => `import {validationResult} from 'express-validator';
export default {
    single: (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const ${resource} = req.params.${resource}Id;
        return res.status(200).json({ ${resource} });
    },
    all: (req, res) => {
        return res.status(200).json([{ ${resource}: "New York" },{ ${resource}: "Chicago" }]);
    }
};`