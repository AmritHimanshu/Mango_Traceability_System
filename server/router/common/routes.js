const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const parsePhoneNumberFromString = require('libphonenumber-js');

const { notifyAdmins } = require('../../functions/sendMail');
const User = require('../../model/userSchema');


router.post('/api/register-user', async (req, res) => {
    const { name, email, phone, password, confirm_password, role } = req.body;
    if (!name || !email || !phone || !password || !confirm_password || !role) {
        return res.status(422).json({ error: "Fill all the fields" });
    }

    if (password !== confirm_password) {
        return res.status(422).json({ error: "Password not matched" });
    }

    const phoneNumberObj = parsePhoneNumberFromString(phone, 'IN');
    if (!phoneNumberObj?.isValid()) {
        return res.status(400).json({ error: 'Invalid phone number' });
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

router.post('/api/signin-user', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Fill all the fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Incorrect credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(422).json({ error: "Incorrect credentials" });
        }

        if (!user.isAuthenticated) {
            return res.status(422).json({ error: "You have not been authorised yet." });
        }

        const Token = await user.generateAuthToken();
        res.cookie("jwtoken", Token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            path: '/',
        });

        const safeUser = await User.findOne({ email }).select("-password -tokens");

        return res.status(201).json(safeUser);
    } catch (error) {
        console.log("/api/sigin-user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(201).json({ message: 'User Logout' });
})

router.get('/', (req, res) => {
    return res.status(200).json({ message: "I am Singh Sahab" });
})


module.exports = router;