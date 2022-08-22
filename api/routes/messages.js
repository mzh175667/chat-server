const express = require("express");

const router = express.Router();
const Messages = require("../model/messages");
const Conversation = require("../model/conversation");

// add
router.post("/", async (req, res) => {
  const newMessages = new Messages(req.body);
  try {
    const savedMessages = await newMessages.save();
    res.status(200).json(savedMessages);
  } catch (error) {
    res.status(500).json(error);
  }

  const updateConversation = await Conversation.findOneAndUpdate(
    { _id: req.body.conversationId },
    {
      lastMessage: req.body.text,
    },
    { new: true }
  );
  // console.log(updateConversation);/
});
// get

router.get("/:conversationId", async (req, res) => {
  try {
    const messagesData = await Messages.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messagesData);
  } catch (error) {
    res.status(500).json(error);
  }
});
// update seen
router.put("/:conversationId", async (req, res) => {
  try {
    const seenData = await Conversation.findOneAndUpdate(
      {
        conversationId: req.params.conversationId,
      },
      {
        $set: {
          seen: true,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(seenData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
