const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

const User = require('../../model/userSchema');
const Farmer = require('../../model/farmerSchema');


router.get('/api/few-pending-requests', async (req, res) => {
    try {
        if (req.rootUser.role !== 'Admin') {
            return res.status(401).json({ error: "You don't have permission." });
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
});

router.get('/api/farmer-management', async (req, res) => {
    const limit = req.query.limit;
    const skip = req.query.skip;
    try {
        const farmers = await User.find({ role: 'Farmer', isAuthenticated: true, isRejected: false }).select("-password -tokens -updatedAt").skip(parseInt(skip)).limit(parseInt(limit));

        return res.status(201).json(farmers);
    } catch (error) {
        console.log("/api/farmer-management: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-farmer-farms-list/:id', async (req, res) => {
    const limit = req.query.limit;
    const skip = req.query.skip;

    const { id } = req.params;
    const _id = new mongoose.Types.ObjectId(id);

    try {
        const farmList = await Farmer.find({ userId: _id }).skip(parseInt(skip)).limit(parseInt(limit));

        return res.status(201).json(farmList);
    } catch (error) {
        console.log("/api/fetch-farmer-farms-list: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-farmer-farm-data/:farm_id', async (req, res) => {
    const { farm_id } = req.params;

    try {
        const farm = await Farmer.findOne({ _id: farm_id });
        return res.status(201).json(farm);
    } catch (error) {
        console.log("/api/fetch-farmer-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;