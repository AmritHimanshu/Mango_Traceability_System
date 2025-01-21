const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
    },
});

// Send OTP for Email verification
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
        console.error("Error sending email to user:", error.message);
    }
};


module.exports = { sendEmail };