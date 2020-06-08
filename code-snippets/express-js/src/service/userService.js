export default {
    single: (req, res) => {
        const user = req.params.userId;
        res.status(200).json({ user });
    },
    all: (req, res) => {
        res.status(200).json([{ user: "New York" },{ user: "Chicago" }]);
    }
};