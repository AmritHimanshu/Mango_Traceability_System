const express = require('express');
const router = express.Router();

const User = require('../../model/userSchema');


router.get('/api/few-pending-requests', async (req, res) => {
    try {
        if (req.rootUser.role !== 'Admin') {
            return res.status(403).json({ error: "You don't have permission." });
        }

        const pendingRequests = await User.find({ isAuthenticated: false }).select("-password -tokens -updatedAt").sort("-createdAt").limit(3);

        return res.status(200).json(pendingRequests);
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
        const pendingRequests = await User.find({ role: { $in: ['Farmer', 'Manager'] }, isAuthenticated: false });

        return res.status(201).json({ noOfFarmers: farmers.length, noOfManagers: managers.length, noOfVerifiedFarmers: verifiedFarmers.length, noOfPendingRequests: pendingRequests.length });
    } catch (error) {
        console.log("/api/fetch-no-of-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = router;