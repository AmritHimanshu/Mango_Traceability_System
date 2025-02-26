const express = require('express');
const router = express.Router();

const User = require('../../model/userSchema');
const Farmer = require('../../model/farmerSchema');

router.delete('/api/delete-farm-data/:id', async (req, res) => {
    const { id } = req.params;
    const { field, index, subField } = req.body;

    try {
        const farm = await Farmer.findOne({ uniqueID: id });

        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        if (!field) {
            return res.status(400).json({ error: 'Field is required' });
        }

        if (index === null || index === undefined) {
            return res.status(400).json({ error: 'Index is required' });
        }

        if (field === 'irrigationDates' && subField) {
            if (!farm[field][subField]) {
                return res.status(400).json({ error: `Sub-field ${subField} does not exist in ${field}` });
            }
            if (!Array.isArray(farm[field][subField])) {
                return res.status(400).json({ error: `Sub-field ${subField} is not an array` });
            }
            if (index < 0 || index >= farm[field][subField].length) {
                return res.status(400).json({ error: `Invalid index for sub-field ${subField}` });
            }

            farm[field][subField].splice(index, 1);
        } else {
            if (!farm[field]) {
                return res.status(400).json({ error: `Field ${field} does not exist` });
            }
            if (!Array.isArray(farm[field])) {
                return res.status(400).json({ error: `Field ${field} is not an array` });
            }
            if (index < 0 || index >= farm[field].length) {
                return res.status(400).json({ error: `Invalid index for field ${field}` });
            }

            farm[field].splice(index, 1);
        }

        await farm.save();

        return res.status(201).json({ message: "Successfully deleted" });
    } catch (error) {
        console.log("/api/delete-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;