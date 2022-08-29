const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema({
  members: {
    type: Array,
    ref: "User",
  },
  seen: { type: Boolean, default: false },
  unSeen: { type: Boolean, default: false },
  lastMessage: String,
});

module.exports = mongoose.model("Conversation", conversationSchema);
