const JWT = require("jsonwebtoken");
const User = require("../model/user-model");

const verify = async (req, res, next) => {
    try {
        // CRITICAL FIX: Cookies are stored on req.cookies (plural).
        const token = req.cookies.jwt; 

        // 1. Check for missing token (Use 401 Unauthorized, and return to stop execution)
        if (!token) {
            // Use 401 for authentication failures
            return res.status(401).send("Unauthorized: No token provided. 1");
        }
        // 2. Verify the token against the secret
        // Note: JWT.verify throws an error on invalid/expired tokens, which will go to the catch block.
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        
        // 3. Find the user and exclude the password hash
        // We can remove the redundant `if (!decoded)` check since the error is handled in catch.
        const user = await User.findById(decoded.userId).select("-pass");

        // 4. Check if the user exists
        if (!user) {
            // Use 401/403 for authentication/authorization issues
            return res.status(401).send("Unauthorized: User not found. 2");
        }

        // 5. Attach the user object to the request
        req.user = user;

        // 6. Proceed to the next middleware/route handler
        next();
    } 
    catch (error) {
        // This handles errors from jwt.verify (expired, invalid signature) or database errors.
        console.error("Authentication Error:", error.message);
        
        // Return 401 for any failure in the authentication process
        // It's safer to use .json({}) here to send structured data.
        return res.status(401).json({ message: "Authentication failed. Invalid or expired token."+ error});
    }
}

module.exports = verify;