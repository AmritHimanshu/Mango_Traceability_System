const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
router.use(cookieParser());


router.post('/api/register-user', async (req, res) => {
    const { name, email, phone, password, confirm_password, role } = req.body;
    if (!name || !email || !phone || !password || !confirm_password || !role) {
        return res.status(422).json({ error: "Fill all the fields" });
    }
});

router.get('/', (req, res) => {
    res.status(200).send({ message: "Hi! I am Singh Sahab" });
});

module.exports = router;