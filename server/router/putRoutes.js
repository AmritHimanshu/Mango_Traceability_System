const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const { notifyFarmer } = require('../functions/sendMail');
const authenticateUser = require('../middleware/authenticateUser');

const User = require('../model/userSchema');


router.put('/api/authenticate-user/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const { isAuthenticated } = req.body;

    try {
        if (req.rootUser.role === 'Farmer') {
            return res.status(401).json({error: "You don't have permission."});
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role !== "Farmer") {
            return res.status(400).json({ error: "Only farmers require authentication" });
        }

        user.isAuthenticated = isAuthenticated;
        await user.save();

        await notifyFarmer(user, isAuthenticated);

        const status = isAuthenticated ? "approved" : "rejected";
        return res.status(200).json({ message: `User has been ${status}` });
    } catch (error) {
        console.log("/api/authenticate-user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;