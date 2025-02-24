const express = require('express');
const router = express.Router();

const User = require('../../model/userSchema');
const Farmer = require('../../model/farmerSchema');

router.delete('/api/delete-farm-data/:id', async(req,res)=>{
    const { id } = req.params;
    console.log(id);
    console.log(req.body);

    try {
        const farm = await Farmer.findOne({ uniqueID: id });
        console.log(farm);
        return res.status(201).json({ message: "Successfully deleted" });
    } catch (error) {
        console.log("/api/delete-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;