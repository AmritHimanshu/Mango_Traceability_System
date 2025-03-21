const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

const Farmer = require('../../model/farmerSchema');

router.get('/api/fetch-farms-list', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    try {
        if (req.rootUser.role !== 'Farmer') {
            return res.status(403).json({ error: "You don't have permission." });
        }

        const farmList = await Farmer.find({ userUniqueId: req.rootUser.uniqueID }).sort("-createdAt").select('farm crop createdAt uniqueID').skip((page - 1) * limit).limit(limit);

        const totalFarms = await Farmer.countDocuments({ userUniqueId: req.rootUser.uniqueID });

        return res.status(201).json({ farmList, totalPages: Math.ceil(totalFarms / limit) });
    } catch (error) {
        console.log("/api/fetch-farms-list: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-search-farms-list', async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const search = req.query.search;

    const query = {
        userUniqueId: req.rootUser.uniqueID
    };

    if (search) {
        query.$or = [
            { farm: { $regex: search, $options: "i" } },
            { crop: { $regex: search, $options: "i" } },
            { uniqueID: { $regex: search, $options: "i" } },
        ].filter(Boolean)
    }

    try {
        const farmList = await Farmer.find(query).skip((page - 1) * limit).limit(Number(limit));

        const totalFarms = await Farmer.countDocuments(query);
        const totalPages = Math.ceil(totalFarms / limit);

        return res.status(201).json({ farmList, totalPages });
    } catch (error) {
        console.log("/api/search-user-management: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-few-farms-list', async (req, res) => {
    try {
        const farmList = await Farmer.find({ userUniqueId: req.rootUser.uniqueID }).sort("-createdAt").select('farm crop geoFenceData uniqueID').limit(4);

        return res.status(201).json(farmList);
    } catch (error) {
        console.log("/api/fetch-few-farms-list: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-farm-data/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const farmData = await Farmer.findOne({ userUniqueId: req.rootUser.uniqueID, uniqueID: id });

        if (!farmData) {
            return res.status(404).json({ error: "Page not found" });
        }

        return res.status(201).json(farmData);
    } catch (error) {
        console.log("/api/fetch-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;