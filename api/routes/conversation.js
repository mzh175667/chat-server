const express = require("express");
const router = express.Router();
const Conversation = require("../model/conversation");
const Messages = require("../model/messages");
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get conversation
router.get("/:userId", async (req, res) => {
  try {
    const conversationData = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversationData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
