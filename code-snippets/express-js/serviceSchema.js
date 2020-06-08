module.exports = (resource) => `export default {
    single: (req, res) => {
        const ${resource} = req.params.${resource}Id;
        res.status(200).json({ ${resource} });
    },
    all: (req, res) => {
        res.status(200).json([{ ${resource}: "New York" },{ ${resource}: "Chicago" }]);
    }
};`