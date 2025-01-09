const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const authenticateUser = require('../../middleware/authenticateUser');
const User = require('../../model/userSchema');


router.get('/api/pending-farmers', authenticateUser, async (req, res) => {
    try {
        if (req.rootUser.role === 'Farmer') {
            return res.status(401).json({error: "You don't have permission."});
        }

        const pendingFarmers = await User.find({ role: "Farmer", isAuthenticated: false }, "-password");

        return res.status(200).json(pendingFarmers);
    } catch (error) {
        console.log("/api/pending-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;