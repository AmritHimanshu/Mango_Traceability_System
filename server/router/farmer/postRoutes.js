const express = require('express');
const router = express.Router();
const { FARMER_NEW_FARM } = require('../../utils/api');

const Farmer = require('../../model/farmerSchema');

router.post(FARMER_NEW_FARM, async (req, res) => {
    try {
        const { farmName, cropName, landmark, coordinates, area } = req.body;

        if (!farmName || !cropName || !landmark || !coordinates || !area) {
            return res.status(400).json({ error: "Fill all the fields" });
        }

        if (coordinates.length < 3) {
            return res.status(400).json({ error: "select minimum 3 coordinates" });
        }

        const farm = new Farmer({
            userUniqueId: req.rootUser.uniqueID,
            farm: farmName,
            crop: cropName,
            landmark: landmark,
            geoFenceData: coordinates.map(coord => ({
                lat: coord[0],
                lng: coord[1],
            })),
            area: area,
        });

        const ID = await farm.generateUniqueID(cropName);

        farm.uniqueID = ID;

        console.log(farm);

        const farmRegister = await farm.save();

        return res.status(201).json({ message: "Farm registered successfully!" });
    } catch (error) {
        console.log("/api/new-farm: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;