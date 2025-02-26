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
  try {
    const { id } = req.params;
    const { field, value, index, subField } = req.body;

    const farmer = await Farmer.findOne({ uniqueID: id });

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    if (index !== null && index !== undefined) {
      if (!farmer[field]) {
        return res.status(400).json({ error: `Field ${field} does not exist` });
      }

      if (field === 'irrigationDates' && subField) {
        if (!farmer[field][subField]) {
          return res.status(400).json({ error: `Sub-field ${subField} does not exist in ${field}` });
        }
        if (!Array.isArray(farmer[field][subField])) {
          return res.status(400).json({ error: `Sub-field ${subField} is not an array` });
        }
        if (index < 0 || index >= farmer[field][subField].length) {
          return res.status(400).json({ error: `Invalid index for sub-field ${subField}` });
        }

        farmer[field][subField][index] = value;
      } else {
        if (!Array.isArray(farmer[field])) {
          return res.status(400).json({ error: `Field ${field} is not an array` });
        }
        if (index < 0 || index >= farmer[field].length) {
          return res.status(400).json({ error: `Invalid index for field ${field}` });
        }

        farmer[field][index] = value;
      }
    } else if (subField && subField !== "") {
      if (!farmer[field]) {
        return res.status(400).json({ error: `Field ${field} does not exist` });
      }
      if (typeof farmer[field] !== 'object' || Array.isArray(farmer[field])) {
        return res.status(400).json({ error: `Field ${field} is not an object` });
      }
      if (!farmer[field][subField]) {
        return res.status(400).json({ error: `Sub-field ${subField} does not exist in ${field}` });
      }

      if (field === 'irrigationDates') {
        if (!Array.isArray(farmer[field][subField])) {
          return res.status(400).json({ error: `Sub-field ${subField} is not an array` });
        }

        farmer[field][subField].push(value);
      } else {
        farmer[field][subField] = value;
      }
    } else {
      if (!farmer[field]) {
        return res.status(400).json({ error: `Field ${field} does not exist` });
      }

      farmer[field] = value;
    }

    await farmer.save();

    return res.status(201).json({ message: "Successfully updated" });
  } catch (error) {
    console.log("/api/edit-farm-data: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;