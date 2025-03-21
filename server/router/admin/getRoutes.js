const express = require('express');
const router = express.Router();

const User = require('../../model/userSchema');
const Farmer = require('../../model/farmerSchema');


router.get('/api/few-pending-requests', async (req, res) => {
    try {
        if (req.rootUser.role !== 'Admin') {
            return res.status(401).json({ error: "You don't have permission." });
        }

        const pendingRequests = await User.find({ isAuthenticated: false, isRejected: false }).select("-password -tokens -updatedAt").sort("-createdAt").limit(5);

        return res.status(201).json(pendingRequests);
    } catch (error) {
        console.log("/api/few-pending-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/pending-requests', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    try {
        const pendingRequests = await User.find({ isAuthenticated: false, isRejected: false }).select("-password -tokens -updatedAt").sort("-createdAt").skip((page - 1) * limit).limit(limit);

        const totalPendingRequests = await User.countDocuments({ isAuthenticated: false, isRejected: false });

        return res.status(201).json({ pendingRequests, totalPages: Math.ceil(totalPendingRequests / limit) });
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

router.get('/api/user-management', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const whichUser = req.query.user;

    try {
        let users = [];
        let totalUsers = 0;
        if (whichUser === "All") {
            users = await User.find({ role: { $in: ["Farmer", "Manager"] }, isAuthenticated: true, isRejected: false }).select("-password -tokens -updatedAt").skip((page - 1) * limit).limit(limit);

            totalUsers = await User.countDocuments({ role: { $in: ["Farmer", "Manager"] }, isAuthenticated: true, isRejected: false });
        }
        else {
            users = await User.find({ role: whichUser, isAuthenticated: true, isRejected: false }).select("-password -tokens -updatedAt").skip((page - 1) * limit).limit(limit);

            totalUsers = await User.countDocuments({ role: whichUser, isAuthenticated: true, isRejected: false });
        }

        return res.status(201).json({ users, totalPages: Math.ceil(totalUsers / limit) });
    } catch (error) {
        console.log("/api/user-management: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/search-user-management', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const search = req.query.search;
    const role = req.query.role;

    const query = {
        isAuthenticated: true,
    };

    if (role && role !== "All") {
        query.role = role;
    } else {
        query.role = { $ne: "Admin" };
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { $expr: { $regexMatch: { input: { $toString: "$phone" }, regex: search, options: "i" } } },
            { uniqueID: { $regex: search, $options: "i" } },
        ].filter(Boolean)
    }

    try {
        const users = await User.find(query).skip((page - 1) * limit).limit(Number(limit));

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(201).json({ users, totalPages });
    } catch (error) {
        console.log("/api/search-user-management: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/search-pending-requests', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const search = req.query.search;

    const query = {
        isAuthenticated: false,
        isRejected: false,
        role: {$ne: "Admin"}
    };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { $expr: { $regexMatch: { input: { $toString: "$phone" }, regex: search, options: "i" } } },
        ].filter(Boolean)
    }

    try {
        const users = await User.find(query).skip((page - 1) * limit).limit(Number(limit));

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(201).json({ users, totalPages });
    } catch (error) {
        console.log("/api/search-user-management: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/farmer-management', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    try {
        const farmers = await User.find({ role: 'Farmer', isAuthenticated: true, isRejected: false }).select("-password -tokens -updatedAt").skip((page - 1) * limit).limit(limit);

        const totalFarmers = await User.countDocuments({ role: 'Farmer', isAuthenticated: true, isRejected: false });

        return res.status(201).json({ farmers, totalPages: Math.ceil(totalFarmers / limit) });
    } catch (error) {
        console.log("/api/farmer-management: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-farmer-farms-list/:id', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const { id } = req.params;

    try {
        const farmList = await Farmer.find({ userUniqueId: id }).sort("-createdAt").skip((page - 1) * limit).limit(limit);

        const totalFarms = await Farmer.countDocuments({ userUniqueId: id });

        const user = await User.find({ uniqueID: id }).select("name uniqueID");

        return res.status(201).send({ farmList, totalPages: Math.ceil(totalFarms / limit), user });
    } catch (error) {
        console.log("/api/fetch-farmer-farms-list: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-farmer-farm-data/:farm_id', async (req, res) => {
    const { farm_id } = req.params;

    try {
        const farm = await Farmer.findOne({ uniqueID: farm_id });

        if (!farm) {
            return res.status(404).json({ error: "Farm not found" });
        }

        const user = await User.findOne({ uniqueID: farm.userUniqueId }).select("name email phone");

        return res.status(201).json({ farm, user });
    } catch (error) {
        console.log("/api/fetch-farmer-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;