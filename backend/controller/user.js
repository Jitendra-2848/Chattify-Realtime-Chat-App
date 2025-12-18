const Register = require("../model/user-model")
const bcrypt = require("bcrypt");
const generateToken = require("../lib/jwt");
const cloud = require("../lib/cloudinary");
const login = async (req, res) => {
    console.log(res);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All field are required!" });
        }
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const passwordword = await bcrypt.compare(password, user.password)
        if (!passwordword) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        res.status(200).json({ message: "Login Successfully!" })
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profile_Pic: user.profile_Pic,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
}
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).send("Logout route");
    } catch (error) {
        res.status(400).send("Successfully logout", error.message);
    }

}
const signup = async (req, res) => {
    // res.status(200).json(req.body);
    console.log(req.body)
    try {
        const { username, email, password } = req.body;
        // console.log(req.body.body);
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (password.length < 6) {
            return res.status(401).json({ message: "Password should be at least 6 characters!" });
        }

        const user = await Register.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "You have already registered with this email." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        const record = new Register({
            username,
            email,
            password: hashpassword,
        });

        // Generate JWT token
        generateToken(record._id, res);

        await record.save();

        return res.status(201).json({
            message: "Successfully Registered!",
            userID: record._id,
            username: record.username,
            email: record.email,
            profile_pic: record.profile_pic,
        });

    } catch (error) {
        console.error("Error in signup:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }

}
const update_profile = async (req, res) => {
    // res.json(req.body);
    console.log(req.body)
    try {
        const { profile_pic,username } = req.body;
        if (!profile_pic && !username) {
            return res.status(405).json({ message: "profile picture is required" });
        }
        const id = req.user._id;
        if(username){
            const updated_profile = await Register.findByIdAndUpdate(id, { username: username })
            return res.status(200).json({ message: "updated successfully" });
        }
        const upload = await cloud.uploader.upload(profile_pic);
        const updated_profile = await Register.findByIdAndUpdate(id, { profile_pic: upload.secure_url })
        return res.status(200).json({ message: "updated successfully" });
        // res.json(upload);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "internal server error"});
    }

}
const check = async (req, res) => {
    try {
        const data = await Register.findById(req.user)
        console.log(data)
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ message: "internal server error" });
    }
}
const getuser = async(req,res)=>{
    try {
        console.log(req.params.id)
        const data = await Register.findById(req.params.id)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ message: "internal server error" });
    }
}
module.exports = {
    login,
    logout,
    signup,
    update_profile,
    check,
    getuser
};