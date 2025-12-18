const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const signup = new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    }, 
    profile_pic:{
        type:String,
        // required:true,
        default:"",
    }
},
{timestamps:true},)

module.exports = model("Register",signup);