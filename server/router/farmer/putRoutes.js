const express = require('express');
const router = express.Router();

const Farmer = require('../../model/farmerSchema');

router.put('/api/save-farm-data/:id', async (req, res) => {
    try {
        console.log(req.body);
        return res.status(201).json({ message: "Done!" });
    } catch (error) {
        console.log("/api/save-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;