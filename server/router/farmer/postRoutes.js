const express = require('express');
const router = express.Router();

const Farmer = require('../../model/farmerSchema');

router.post('/api/new-farm', async (req, res) => {
    try {
        const { farmName, cropName, coordinates, area } = req.body;

        if (!farmName || !cropName || !coordinates || !area) {
            return res.status(400).json({ error: "Fill all the fields" });
        }

        if (coordinates.length < 3) {
            return res.status(400).json({ error: "select minimum 3 coordinates" });
        }

        const farm = new Farmer({
            userId: req.rootUser,
            farm: farmName,
            crop: cropName,
            geoFenceData: coordinates.map(coord => ({
                lat: coord[0],
                lng: coord[1],
            })),
            area: area,
        });

        const farmRegister = await farm.save();

        return res.status(201).json({message: "Farm registered successfully!"});
    } catch (error) {
        console.log("/api/new-farm: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;