export default {
    single: (req, res) => {
        const address = req.params.addressId;
        res.status(200).json({ address });
    },
    all: (req, res) => {
        res.status(200).json([{ address: "New York" },{ address: "Chicago" }]);
    }
};