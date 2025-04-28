const nodemailer = require("nodemailer");
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

// Send OTP for Email verification
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_ID?.trim(),
        pass: process.env.PASSWORD?.trim(),
    },
});

const sendEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: "Your OTP for Verification",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Otp sent to your email:", info.response);
    } catch (error) {
        console.log("Error in sending otp: ", error);
    }
};

// Send OTP for Phone verification
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendPhone = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.PHONE_NUMBER,
            to: `+91${phone}`,
        });
        console.log(`Message sent: ${message.sid}`);
    } catch (error) {
    }
};


module.exports = { sendEmail, sendPhone };