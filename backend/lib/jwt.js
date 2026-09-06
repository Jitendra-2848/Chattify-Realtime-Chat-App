const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const isProduction =
    process.env.NODE_ENV === "production" || process.env.status === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    // In production across domains (e.g., Render + Vercel), secure must be true and sameSite "none"
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateToken;
