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
const notifyAdmins = async (farmer) => {
    try {
        const admins = await User.find({ role: { $in: ["Admin", "Manager"] } }, "email");
        const adminEmails = admins.map((admin) => admin.email);

        if (adminEmails.length === 0) {
            console.log("No admin emails found.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: adminEmails,
            subject: "New Farmer Registration Request",
            text: `A new farmer has registered. 
                   Name: ${farmer.name} 
                   Email: ${farmer.email}
                   Phone: ${farmer.phone}
                   
                   Please visit the dashboard to approve or reject this registration.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to admins:", info.response);
    } catch (error) {
        console.error("Error sending email to admins:", error.message);
    }
};

// Send Mail to Farmer
const notifyFarmer = async (farmer, status) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: farmer.email,
            subject: `Registration ${status ? "Approved" : "Rejected"}`,
            text: `Dear ${farmer.name}, your registration has been ${status ? "approved" : "rejected"}. 
                Now you can login to your account.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent to farmer:", info.response);
    } catch (error) {
        console.error("Error sending email to farmer:", error.message);
    }
};

module.exports = { notifyAdmins, notifyFarmer };
