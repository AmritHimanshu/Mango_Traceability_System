const nodemailer = require("nodemailer");
const User = require("../model/userSchema");


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
    },
});

// Send Mail to Admins
const notifyAdmins = async (user) => {
    try {
        let admins;
        if (user.role === 'Farmer') {
            admins = await User.find({ role: { $in: ["Admin", "Manager"] }, isAuthenticated: true }, "email");
        }
        else {
            admins = await User.find({ role: { $in: ["Admin"] }, isAuthenticated: true }, "email");
        }

        const adminEmails = admins.map((admin) => admin.email);

        if (adminEmails.length === 0) {
            console.log("No admin emails found.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: adminEmails,
            subject: "New User Registration Request",
            text: `A new user has registered. 
                   Name: ${user.name} 
                   Email: ${user.email}
                   Phone: ${user.phone}
                   Role: ${user.role}
                   
                   Please visit the dashboard to approve or reject this registration.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to admins:", info.response);
    } catch (error) {
        console.error("Error sending email to admins:", error.message);
    }
};

// Send Mail to Farmer
const notifyUser = async (user, status) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: user.email,
            subject: `Registration ${status ? "Approved" : "Rejected"}`,
            text: `Dear ${user.name}, your registration has been ${status ? "approved" : "rejected"}. 
                Now you can login to your account.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to user:", info.response);
    } catch (error) {
        console.error("Error sending email to user:", error.message);
    }
};

// Weather notification to the farmers
const notifyWeatherReport = async (user, subject, message) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: user.email,
            subject: subject,
            text: message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to user about the weather:", info.response);
    } catch (error) {
        console.error("Error sending weather notification on email to user:", error.message);
    }
};

module.exports = { notifyAdmins, notifyUser, notifyWeatherReport };
