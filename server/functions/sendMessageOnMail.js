const nodemailer = require("nodemailer");
const User = require("../model/userSchema");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
    },
});

const sendMessageOnMail = async (name, email, message) => {
    try {
        const admins = await User.find({ role: "Admin", isAuthenticated: true }, "email");

        const adminEmails = admins.map((admin) => admin.email);

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: adminEmails,
            subject: `Message from ${name}, email: ${email}`,
            text: `${message}`,
        };
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
    }
};

module.exports = sendMessageOnMail;