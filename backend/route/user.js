const route = require("express").Router();
const protectRoute = require("../middleware/auth_user")
const user = require("../controller/user")
const cloud = require("../lib/cloudinary")
route.post("/login",user.login);
route.post("/signup",user.signup);
route.post("/logout",user.logout);
route.put("/update-profile",protectRoute,user.update_profile);
route.get("/check",protectRoute,user.check);
route.get("/user/:id",protectRoute,user.getuser)
// route.get()

module.exports = route;

// npm i --save-dev @types/node