const express = require('express');
const router = express.Router();

router.post('/api/new-farm', async (req, res) => {
    try {
        const { farmName, cropName, coordinates } = req.body;
        console.log(farmName, cropName, coordinates);
        return res.status(201).json({ message: "OK" });
    } catch (error) {
        console.log("/api/new-farm: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;