const express = require('express');
const router = express.Router();

const Farmer = require('../../model/farmerSchema');

router.post('/api/new-farm', async (req, res) => {
    try {
        const { farmName, cropName, coordinates } = req.body;

        if (!farmName || !cropName || !coordinates) {
            return res.status(422).json({ error: "Fill all the fields" });
        }

        if (coordinates.length < 3) {
            return res.status(422).json({ error: "select minimum 3 coordinates" });
        }

        

        return res.status(201).json({ message: "OK" });
    } catch (error) {
        console.log("/api/new-farm: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;