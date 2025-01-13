const express = require('express');
const router = express.Router();

const User = require('../../model/userSchema');


router.get('/api/few-pending-requests', async (req, res) => {
    try {
        if (req.rootUser.role !== 'Admin') {
            return res.status(403).json({ error: "You don't have permission." });
        }

        const pendingRequests = await User.find({ isAuthenticated: false, isRejected: false }).select("-password -tokens -updatedAt").sort("-createdAt").limit(3);

        return res.status(201).json(pendingRequests);
    } catch (error) {
        console.log("/api/few-pending-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/pending-requests', async (req, res) => {
    const limit = req.query.limit;
    const skip = req.query.skip;
    try {
        const pendingRequests = await User.find({ isAuthenticated: false, isRejected: false }).select("-password -tokens -updatedAt").sort("-createdAt").skip(parseInt(skip)).limit(parseInt(limit));

        return res.status(201).json(pendingRequests);
    } catch (error) {
        console.log("/api/pending-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-no-of-users', async (req, res) => {
    try {
        const verifiedManagers = await User.find({ role: 'Manager', isAuthenticated: true, isRejected: false });
        const verifiedFarmers = await User.find({ role: 'Farmer', isAuthenticated: true });
        const pendingRequests = await User.find({ isAuthenticated: false, isRejected: false });
        const rejectedRequests = await User.find({ isRejected: true });

        return res.status(201).json({ noOfVerifiedManagers: verifiedManagers.length, noOfVerifiedFarmers: verifiedFarmers.length, noOfPendingRequests: pendingRequests.length, noOfRejectedRequests: rejectedRequests.length });
    } catch (error) {
        console.log("/api/fetch-no-of-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/manager-management', async (req, res) => {
    const limit = req.query.limit;
    const skip = req.query.skip;
    try {
        const managers = await User.find({ role: 'Manager', isAuthenticated: true, isRejected: false }).select("-password -tokens -updatedAt").skip(parseInt(skip)).limit(parseInt(limit));

        return res.status(201).json(managers);
    } catch (error) {
        console.log("/api/manager-management: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = router;