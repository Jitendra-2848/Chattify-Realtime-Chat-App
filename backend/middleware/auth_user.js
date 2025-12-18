const JWT = require("jsonwebtoken");
const User = require("../model/user-model");

const verify = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; 
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided. 1");
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-pass");
        if (!user) {
            return res.status(401).send("Unauthorized: User not found. 2");
        }
        req.user = user;
        next();
    } 
    catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Authentication failed. Invalid or expired token."+ error});
    }
}

module.exports = verify;