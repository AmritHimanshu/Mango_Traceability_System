const express = require('express');
const router = express.Router();

const { notifyUser } = require('../../functions/sendMail');

const User = require('../../model/userSchema');


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
            const usersOfSameRole = await User.find({ role , isAuthenticated: true, isRejected: false});

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


module.exports = router;