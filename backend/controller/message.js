const User = require("../model/user-model");
const Message = require("../model/message-model");
const cloud = require("../lib/cloudinary");
const { Server } = require('socket.io');

const getUserSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filtered = await User.find({ _id: { $ne: userId } }).select("-pass");
    res.status(200).json({ message: filtered });
  } catch (error) {
    console.log("Error in getUserSidebar:", error.message);
    res.status(500).json({ message: "Error getting sidebar users" });
  }
};

const getmessage = async (req, res) => {
  try {
    const { id: UserChatId } = req.params;
    const Myid = req.user?._id;

    if (!Myid) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const chat = await Message.findOne({
      $or: [
        { SenderId: Myid, RecieverId: UserChatId },
        { SenderId: UserChatId, RecieverId: Myid },
      ],
    });

    res.status(200).json({
      success: true,
      data:chat ? chat : null,
      messages: chat ? chat.messages : [],
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while fetching messages",
      error: error.message,
    });
  }
};
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: UserChatId } = req.params;
    const senderId = req.user._id;

    let ImgUrl = null;
    if (image) {
      const response = await cloud.uploader.upload(image);
      ImgUrl = response.secure_url;
    }

    // Check if chat already exists
    let chat = await Message.findOne({
      $or: [
        { SenderId: senderId, RecieverId: UserChatId },
        { SenderId: UserChatId, RecieverId: senderId },
      ],
    });

    // If not exist, create new document
    if (!chat) {
      chat = new Message({
        SenderId: senderId,
        RecieverId: UserChatId,
        messages: [],
      });
    }

    // Push new message into messages array
    chat.messages.push({
      sender: senderId,
      text,
      image: ImgUrl,
    });

    await chat.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      chat,
    });
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
const delchat = async(req,res)=>{
  try {
    const UserChatId = req.params.id;
    const senderId = req.user;
    const data = await Message.deleteOne({
      $or: [
        { SenderId: senderId, RecieverId: UserChatId },
        { SenderId: UserChatId, RecieverId: senderId },
      ],
    })
    return res.status(200).json({message:"chat deleted"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"internal server error"})
  }
}
module.exports = {
  getUserSidebar,
  getmessage,
  sendMessage,
  delchat
};
