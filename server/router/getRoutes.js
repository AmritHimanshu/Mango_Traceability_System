const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const User = require('../model/userSchema');


router.get('/api/pending-farmers', async (req, res) => {
    try {
        const pendingFarmers = await User.find({ role: "Farmer", isAuthenticated: false }, "-password");
        
        return res.status(200).json(pendingFarmers);
    } catch (error) {
        console.log("/api/pending-farmers: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/', (req, res) => {
    res.status(200).send({ message: "Hi! I am Singh Sahab (get)" });
});

module.exports = router;