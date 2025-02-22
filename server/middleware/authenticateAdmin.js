const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!verifyToken) {
            return res.status(401).json({ error: "Token has expired" });
        }

        const rootUser = await User.findOne({ uniqueID: verifyToken.uniqueID, "tokens.token": token });
        if (!rootUser) {
            return res.status(401).json({ error: "User not found" });
        }

        if(rootUser.role !== 'Admin'){
            return res.status(403).json({error: "You don't have permission."});
        }

        req.rootUser = rootUser;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Unauthorized: Token has expired" });
        } else {
            return res.status(401).json({ error: "Unauthorized: No valid token provided" });
        }
    }
}

module.exports = authenticateAdmin;