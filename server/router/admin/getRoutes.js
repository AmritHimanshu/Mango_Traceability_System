const express = require('express');
const router = express.Router();

const User = require('../../model/userSchema');


router.get('/api/pending-farmers', async (req, res) => {
    try {
        if (req.rootUser.role !== 'Admin') {
            return res.status(403).json({ error: "You don't have permission." });
        }

        const pendingFarmers = await User.find({ role: "Farmer", isAuthenticated: false }).select("-password");

        return res.status(200).json(pendingFarmers);
    } catch (error) {
        console.log("/api/pending-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-no-of-users', async (req, res) => {
    try {
        const farmers = await User.find({ role: 'Farmer' });
        const managers = await User.find({ role: 'Manager' });
        const verifiedFarmers = await User.find({ role: 'Farmer', isAuthenticated: true });
        return res.status(201).json({ farmers: farmers.length, managers: managers.length, verifiedFarmers: verifiedFarmers.length });
    } catch (error) {
        console.log("/api/fetch-no-of-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = router;