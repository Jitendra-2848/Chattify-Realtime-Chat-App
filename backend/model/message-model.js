const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    SenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    RecieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        image: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
