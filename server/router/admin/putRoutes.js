const express = require('express');
const router = express.Router();

const { notifyUser } = require('../../functions/sendMail');

const User = require('../../model/userSchema');


router.put('/api/authenticate-user/:id', async (req, res) => {
    const { id } = req.params;
    const { isAuthenticated } = req.body;

    try {
        if (req.rootUser.role !== 'Admin') {
            return res.status(403).json({error: "You don't have permission."});
        }

        if(isAuthenticated === undefined){
            return res.status(401).json({error: "Bad request"});
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role === "Admin") {
            return res.status(400).json({ error: "Admin doesn't require authentication" });
        }

        user.isAuthenticated = isAuthenticated;
        await user.save();

        await notifyUser(user, isAuthenticated);

        const status = isAuthenticated ? "approved" : "rejected";
        return res.status(200).json({ message: `User has been ${status}` });
    } catch (error) {
        console.log("/api/authenticate-user: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;