const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

const Farmer = require('../../model/farmerSchema');

router.get('/api/fetch-farms-list', async (req, res) => {
    const limit = req.query.limit;
    const skip = req.query.skip;
    try {
        if (req.rootUser.role !== 'Farmer') {
            return res.status(403).json({ error: "You don't have permission." });
        }

        const farmList = await Farmer.find({ userUniqueId: req.rootUser.uniqueID }).sort("-createdAt").select('farm crop createdAt uniqueID').skip(parseInt(skip)).limit(parseInt(limit));

        return res.status(201).json(farmList);
    } catch (error) {
        console.log("/api/fetch-farms-list: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-few-farms-list', async (req, res) => {
    try {
        const farmList = await Farmer.find({ userUniqueId: req.rootUser.uniqueID }).sort("-createdAt").select('farm crop geoFenceData').limit(2);

        return res.status(201).json(farmList);
    } catch (error) {
        console.log("/api/fetch-few-farms-list: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/fetch-farm-data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const _id = new mongoose.Types.ObjectId(id);

        const farmData = await Farmer.findOne({ userId: req.rootUser._id, _id: _id });

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