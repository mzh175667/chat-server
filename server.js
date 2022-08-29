const port = process.env.PORT || 5000;
const { findByIdAndUpdate } = require("./api/model/student");
const app = require("./App");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user?.userId === userId) &&
    users.push({ userId, socketId });
  // const user = findByIdAndUpdate()
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (id) => {
  return users.find((user) => user.userId === id);
};
// ////////////////////////////including socket.io...
// when connect
io.on("connection", (socket) => {
  console.log("socket.io is active");

  // send and get messages
  socket.on("sendmessages", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  socket.on("sendConversation", ({ user, senderId }) => {
    const userData = getUser(senderId);
    io.to(userData?.socketId).emit("getConversation", {
      user,
    });
  });
  socket.on(
    "sendNotification",
    ({ msg, receiverId, senderId, conversationId, createdAt }) => {
      const notification = getUser(receiverId);
      io.to(notification?.socketId).emit("getNotification", {
        msg,
        senderId,
        conversationId,
        createdAt,
      });
    }
  );
  socket.on("sendDataForSeen", ({ forSeen, receiverId }) => {
    const ForSeen = getUser(receiverId);
    if (ForSeen && ForSeen.socketId) {
      io.to(ForSeen.socketId).emit("getDataForSeen", {
        forSeen,
      });
    }
  });
  socket.on("sendNotificationForFollowers", ({ senderName, receiverId }) => {
    const followNotification = getUser(receiverId);
    io.to(followNotification?.socketId).emit("getNotificationForFollowers", {
      senderName,
    });
  });

  socket.on("showingLastMessage", ({ conversation }) => {
    io.emit("getLastMessage", {
      conversation,
    });
  });

  // take use_id from client side
  socket.on("addUser", (id) => {
    addUser(id, socket.id);
    io.emit("getUsers", users);
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("socket.io is disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(port, console.log(`listening on the ${port}`));
