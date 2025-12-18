const route = require("express").Router();
const protectRoute = require("../middleware/auth_user")
const user = require("../controller/user")
route.post("/login",user.login);
route.post("/signup",user.signup);
route.post("/logout",user.logout);
route.put("/update-profile",protectRoute,user.update_profile);
route.get("/check",protectRoute,user.check);
route.get("/user/:id",protectRoute,user.getuser)

module.exports = route;
