const express = require('express');
const router = express.Router();

const { notifyUser } = require('../../functions/sendMail');

const User = require('../../model/userSchema');
const Farmer = require('../../model/farmerSchema');


router.put('/api/authenticate-user/:id', async (req, res) => {
    const { id } = req.params;
    const { role, isAuthenticated } = req.body;

    try {
        if (isAuthenticated === undefined) {
            return res.status(400).json({ error: "Bad request" });
        }

        if (!role && isAuthenticated === true) {
            return res.status(400).json({ error: "Bad request" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (role) user.role = role;
        user.isAuthenticated = isAuthenticated;

        if (isAuthenticated === false) user.isRejected = true;
        if (isAuthenticated === true) {
            const usersOfSameRole = await User.find({ role, isAuthenticated: true, isRejected: false });

            const lengthOfUsers = usersOfSameRole.length;

            const ID = await user.generateUniqueID(role, user.createdAt, lengthOfUsers);
            user.uniqueID = ID;
        }

        await user.save();

        await notifyUser(user, isAuthenticated);

        const status = isAuthenticated ? "approved" : "rejected";
        return res.status(201).json({ message: `User has been ${status}` });
    } catch (error) {
        console.log("/api/authenticate-user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/api/edit-farm-data/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { id } = req.params;
        const { field, value, index, subField } = req.body; // field: field name, value: new value, index: for arrays, subField: for nested objects

        // Find the farmer by ID
        const farmer = await Farmer.findById(id);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        // Handle nested fields (e.g., arrays like weedingDate or objects like irrigationDates)
        if (index !== undefined) {
            // Update a specific element in an array
            if (!farmer[field]) {
                return res.status(400).json({ error: `Field ${field} does not exist` });
            }
            if (!Array.isArray(farmer[field])) {
                return res.status(400).json({ error: `Field ${field} is not an array` });
            }
            if (index < 0 || index >= farmer[field].length) {
                return res.status(400).json({ error: `Invalid index for field ${field}` });
            }
            farmer[field][index] = value;
        } else if (subField !== undefined) {
            // Update a nested field in an object (e.g., irrigationDates.artificial)
            if (!farmer[field]) {
                return res.status(400).json({ error: `Field ${field} does not exist` });
            }
            if (typeof farmer[field] !== 'object' || Array.isArray(farmer[field])) {
                return res.status(400).json({ error: `Field ${field} is not an object` });
            }
            if (!farmer[field][subField]) {
                return res.status(400).json({ error: `Sub-field ${subField} does not exist in ${field}` });
            }
            farmer[field][subField] = value;
        } else {
            // Update a regular field
            if (!farmer[field]) {
                return res.status(400).json({ message: `Field ${field} does not exist` });
            }
            farmer[field] = value;
        }

        // Save the updated farmer document
        await farmer.save();

        // Return the updated farmer data
        return res.status(201).json({ message: "Successfully updated" });
    } catch (error) {
        console.log("/api/edit-farm-data: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;