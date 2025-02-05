const express = require('express');
const router = express.Router();
const Farmer = require('../../model/farmerSchema');

router.delete('/api/delete-farm/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const farm = await Farmer.findById(id);

        if (JSON.stringify(req.rootUser._id) !== JSON.stringify(farm.userId)) {
            return res.status(403).json({ error: "You are not authorized to delete." });
        }

        if (!farm) {
            return res.status(404).json({ error: "Farm not found" });
        }

        await farm.deleteOne();

        return res.status(201).json({ message: "Successfully deleted" });
    } catch (error) {
        console.log("/api/delete-farm: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;