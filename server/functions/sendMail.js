const nodemailer = require('nodemailer');

const User = require('../model/userSchema');

// Send Mail to Admins
export const notifyAdmins = async (farmer) => {
    const admins = await User.find({ role: { $in: ["Admin", "Manager"] } }, "email");
    const adminEmails = admins.map(admin => admin.email);

    if (!process.env.EMAIL_ID || !process.env.PASSWORD) {
        throw new Error("Missing email credentials in environment variables.");
    }

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD,
        },
    });

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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};


// Send Mail to Farmer
export const notifyFarmer = async (farmer, status) => {
    if (!process.env.EMAIL_ID || !process.env.PASSWORD) {
        throw new Error("Missing email credentials in environment variables.");
    }

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: farmer.email,
        subject: `Registration ${status ? "Approved" : "Rejected"}`,
        text: `Dear ${farmer.name}, your registration has been ${status ? "approved" : "rejected"}. 
            Now you can login to your account.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};
