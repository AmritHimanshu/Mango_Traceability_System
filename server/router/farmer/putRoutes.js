const express = require('express');
const router = express.Router();

const Farmer = require('../../model/farmerSchema');

router.put('/api/save-farm-data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No fields to update provided." });
        }

        const arrayFieldsKeys = ['fertilizerApplications', 'pesticideApplications', 'bagging', 'specialCare'];

        const arrayFields = {};
        const nonArrayFields = {};

        for (const key in updates) {
            if (arrayFieldsKeys.includes(key)) {
                arrayFields[key] = updates[key];
            } else if (key === 'irrigationDates') {
                const { artificial, natural } = updates[key];

                if (artificial && artificial.length > 0) {
                    arrayFields['irrigationDates.artificial'] = artificial;
                }

                if (natural && natural.length > 0) {
                    arrayFields['irrigationDates.natural'] = natural;
                }
            } else {
                nonArrayFields[key] = updates[key];
            }
        }

        const updateQuery = {};

        if (Object.keys(arrayFields).length > 0) {
            updateQuery.$push = {};

            for (const key in arrayFields) {
                updateQuery.$push[key] = { $each: Array.isArray(arrayFields[key]) ? arrayFields[key] : [arrayFields[key]] };
            }            
        }

        if (Object.keys(nonArrayFields).length > 0) {
            updateQuery.$set = nonArrayFields;
        }

        const updatedFarmer = await Farmer.findByIdAndUpdate(
            id,
            updateQuery,
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