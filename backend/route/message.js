const route = require("express").Router();
const protectRoute = require("../middleware/auth_user")
const message = require("../controller/message")

route.get("/users",protectRoute,message.getUserSidebar);
route.get("/getmsg/:id",protectRoute,message.getmessage);
route.post("/send/:id",protectRoute,message.sendMessage)
route.post("/delchat/:id",protectRoute,message.delchat)
module.exports = route;