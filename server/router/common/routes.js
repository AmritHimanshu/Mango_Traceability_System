const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const parsePhoneNumberFromString = require('libphonenumber-js');
const puppeteer = require('puppeteer');

const { SIGNIN_USER, CONTACT_US_MAIL, REGISTER_USER, SEND_OTP_EMAIL_WITHOUTCAPTCHA, SEND_OTP_EMAIL, FORGOT_SEND_OTP_EMAIL, VERIFY_OTP_EMAIL, SEND_OTP_PHONE_WITHOUTCAPTCHA, SEND_OTP_PHONE, VERIFY_OTP_PHONE, UPDATE_PASSWORD, LOGOUT_USER, CERTIFICATE_FARM_DETAIL, GENERATE_PDF, GET_NOTIFICATION, RECAPTCHA_API } = require('../../utils/api');

const { notifyAdmins } = require('../../functions/sendMail');
const { sendOtpToEmail, verifyOtpForEmail, sendOtpToPhone, verifyOtpForPhone } = require('../../functions/otpService');
const generateHTML = require('../../functions/generate-pdf');
const sendMessageOnMail = require('../../functions/sendMessageOnMail');

const User = require('../../model/userSchema');
const Farmer = require('../../model/farmerSchema');
const Notification = require('../../model/notificationSchema');


router.post(REGISTER_USER, async (req, res) => {
    const { name, email, phone, password, confirm_password } = req.body;
    if (!name || !email || !phone || !password || !confirm_password) {
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

        const user = new User({ name, email, phone, password, isAuthenticated: false });
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

router.post(SIGNIN_USER, async (req, res) => {
    const { email, password, capchaToken } = req.body;
    if (!email || !password || !capchaToken) {
        return res.status(422).json({ error: "Fill all the fields and complete the captcha." });
    }

    try {
        const recaptchaResponse = await fetch(`${RECAPTCHA_API}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: capchaToken
            })
        });

        const verificationData = await recaptchaResponse.json();
        if (!verificationData.success) {
            return res.status(400).json({ error: "reCAPTCHA validation failed." });
        }

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

router.post(CONTACT_US_MAIL, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(422).json({ error: "Fill all fields" });
        }
        await sendMessageOnMail(name, email, phone, message);
        res.status(201).json({ message: "Message sent" });
    } catch (error) {
        console.log("/api/contact-us-mail: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post(SEND_OTP_EMAIL_WITHOUTCAPTCHA, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(422).json({ error: "Fill the email" });
    }

    try {
        await sendOtpToEmail(email);
        res.status(201).json({ message: "OTP sent successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP." });
    }
});

router.post(SEND_OTP_EMAIL, async (req, res) => {
    const { email, capchaToken } = req.body;

    if (!email || !capchaToken) {
        return res.status(422).json({ error: "Fill the email and complete the captcha." });
    }

    try {
        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: capchaToken
            })
        });

        const verificationData = await recaptchaResponse.json();
        if (!verificationData.success) {
            return res.status(400).json({ error: "reCAPTCHA validation failed." });
        }

        await sendOtpToEmail(email);
        res.status(201).json({ message: "OTP sent successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP." });
    }
});

router.post(FORGOT_SEND_OTP_EMAIL, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Email not found" });
        }

        await sendOtpToEmail(email);
        res.status(201).json({ message: "OTP sent successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP ( Internal Server Error )" });
    }
});

router.post(VERIFY_OTP_EMAIL, (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required." });
    }

    const isValid = verifyOtpForEmail(email, otp);
    if (isValid) {
        res.status(201).json({ message: "OTP verified successfully." });
    } else {
        res.status(400).json({ error: "Invalid or expired OTP." });
    }
});

router.post(SEND_OTP_PHONE_WITHOUTCAPTCHA, async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(422).json({ error: "Fill all the fields" });
    }

    try {
        await sendOtpToPhone(phone);
        res.status(201).json({ message: "OTP sent successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP ( Internal Server Error )" });
    }
});

router.post(SEND_OTP_PHONE, async (req, res) => {
    const { phone, capchaToken } = req.body;

    if (!phone || !capchaToken) {
        return res.status(422).json({ error: "Fill all the fields and complete the captcha." });
    }

    try {
        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: capchaToken
            })
        });

        const verificationData = await recaptchaResponse.json();
        if (!verificationData.success) {
            return res.status(400).json({ error: "reCAPTCHA validation failed." });
        }

        await sendOtpToPhone(phone);
        res.status(201).json({ message: "OTP sent successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send OTP ( Internal Server Error )" });
    }
});

router.post(VERIFY_OTP_PHONE, (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: "Email and OTP are required." });
    }

    const isValid = verifyOtpForPhone(phone, otp);
    if (isValid) {
        res.status(201).json({ message: "OTP verified successfully." });
    } else {
        res.status(400).json({ error: "Invalid or expired OTP." });
    }
});

router.post(UPDATE_PASSWORD, async (req, res) => {
    const { email, password, confirm_password } = req.body;

    if (!password || !confirm_password) {
        return res.status(400).json({ error: "Empty fields" });
    }

    if (password !== confirm_password) {
        return res.status(401).json({ error: "Passwords not matched" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.findOneAndUpdate({ email: email }, { password: hashedPassword }, { new: true });

        if (!user) {
            return res.status(400).json({ error: "Email not found" });
        }

        return res.status(201).json({ message: "Password successfully updated" });
    } catch (error) {
        console.log("/api/update-password: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get(`${CERTIFICATE_FARM_DETAIL}/:farm_id`, async (req, res) => {
    const { farm_id } = req.params;

    try {
        const farm = await Farmer.findOne({ uniqueID: farm_id });

        const user = await User.findOne({ uniqueID: farm.userUniqueId }).select("name email phone");

        return res.status(201).json({ farm, user });
    } catch (error) {
        console.log("/api/certificate-farm-detail: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get(LOGOUT_USER, (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(201).json({ message: 'User Logout' });
})

router.get(GENERATE_PDF, async (req, res) => {
    try {
        const { farm_id } = req.query;

        const farmData = await Farmer.findOne({ uniqueID: farm_id });

        const html = generateHTML(farmData);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=farm-report.pdf");

        res.end(pdfBuffer);
    } catch (error) {
        console.log("/api/generate-pdf: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get(GET_NOTIFICATION, async (req,res)=>{
    try {
        const userId = req.query.userId;

        const notification = await Notification.find({userUniqueId: userId, read: false}).sort("-createdAt");

        return res.status(201).json(notification);
    } catch (error) {
        console.log("/api/get-notification: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/', (req, res) => {
    return res.status(201).json({ message: "I am Singh Sahab" });
})


module.exports = router;