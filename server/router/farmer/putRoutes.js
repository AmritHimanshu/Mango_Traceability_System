const express = require('express');
const router = express.Router();

const Farmer = require('../../model/farmerSchema');

router.put('/api/save-farm-data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        console.log(updates);
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No fields to update provided." });
        }

        const updatedFarmer = await Farmer.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        if (!updatedFarmer) {
            return res.status(404).json({ error: "Farm not found." });
        }

        return res.status(201).json({ message: "Farm data updated successfully!" });
    } catch (error) {
        console.log("/api/save-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;