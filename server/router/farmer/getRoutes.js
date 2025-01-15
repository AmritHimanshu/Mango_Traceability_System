const express = require('express');
const router = express.Router();

const Farmer = require('../../model/farmerSchema');

router.get('/api/fetch-farms-list', async (req, res) => {
    const limit = req.query.limit;
    const skip = req.query.skip;
    try {
        if (req.rootUser.role !== 'Farmer') {
            return res.status(403).json({ error: "You don't have permission." });
        }

        const farmList = await Farmer.find({ userId: req.rootUser._id }).sort("-createdAt").skip(parseInt(skip)).limit(parseInt(limit));

        return res.status(201).json(farmList);
    } catch (error) {
        console.log("/api/fetch-farms-list: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;