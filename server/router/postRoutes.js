const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

const { notifyAdmins } = require('../functions/sendMail');
const User = require('../model/userSchema');


router.post('/api/register-user', async (req, res) => {
    const { name, email, phone, password, confirm_password, role } = req.body;
    if (!name || !email || !phone || !password || !confirm_password || !role) {
        return res.status(422).json({ error: "Fill all the fields" });
    }

    if (password !== confirm_password) {
        return res.status(422).json({ error: "Password not matched" });
    }

    try {
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            return res.status(422).json({ error: "Email ID already registered" });
        }

        const user = new User({ name, email, phone, password, role, isAuthenticated: false });
        const userRegister = await user.save();
        if (userRegister) {

            await notifyAdmins(userRegister);

            return res.status(201).json({ message: "User registered. Waiting for approval." });
        }
    } catch (error) {
        console.log("/api/register-user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;