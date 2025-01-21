const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const parsePhoneNumberFromString = require('libphonenumber-js');

const { notifyAdmins } = require('../../functions/sendMail');
const { sendOtpToEmail, verifyOtpForEmail } = require('../../functions/otpService');

const User = require('../../model/userSchema');


router.post('/api/register-user', async (req, res) => {
    const { name, email, phone, password, confirm_password, role } = req.body;
    if (!name || !email || !phone || !password || !confirm_password || !role) {
        return res.status(400).json({ error: "Fill all the fields" });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ error: "Password not matched" });
    }

    const phoneNumberObj = parsePhoneNumberFromString(phone, 'IN');
    if (!phoneNumberObj?.isValid()) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    try {
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            return res.status(400).json({ error: "Email ID already registered" });
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
            return res.status(401).json({ error: "Incorrect credentials" });
        }

        if (!user.isAuthenticated) {
            return res.status(403).json({ error: "You have not been authorised yet." });
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

router.post("/api/send-otp-email", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        await sendOtpToEmail(email);
        res.status(201).json({ message: "OTP sent successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP." });
    }
});

router.post("/api/verify-otp-email", (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required." });
    }

    const isValid = verifyOtpForEmail(email, otp);
    if (isValid) {
        res.status(201).json({ message: "OTP verified successfully." });
    } else {
        res.status(400).json({ error: "Invalid or expired OTP." });
    }
});

router.get('/api/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(201).json({ message: 'User Logout' });
})

router.get('/', (req, res) => {
    return res.status(201).json({ message: "I am Singh Sahab" });
})


module.exports = router;