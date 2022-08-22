const express = require("express");
const app = express();
const studentRoute = require("./api/routes/student");
const facultyRoute = require("./api/routes/faculty");
const userRoute = require("./api/routes/user");
const conversationRoute = require("./api/routes/conversation");
const messagesRoute = require("./api/routes/messages");
const followRoute = require("./api/routes/follow");
const uploadingFile = require("./api/routes/uploadingFile");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fileUpload = require("express-fileupload");

// const urlencoded = require("body-parser/lib/types/urlencoded");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Zulqarnain:175667@cluster0.zep2o.mongodb.net/?retryWrites=true&w=majority"
);

mongoose.connection.on("error", (err) => {
  console.log("db connection failed");
});
mongoose.connection.on("connected", (connected) => {
  console.log("db connected successfully");
});
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/student", studentRoute);
app.use("/faculty", facultyRoute);
app.use("/user", userRoute);
app.use("/conversation", conversationRoute);
app.use("/messages", messagesRoute);
app.use("/users", followRoute);
// app.use("/uploading/file", uploadingFile);
// uploading files using multer///////////////
const fileStorageEngine = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });
app.post("/uploading/file", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("ok ");
});
app.post("/uploading/multiple/files", upload.array("images"), (req, res) => {
  console.log(req.files);
  res.send("multiple ");
});
///////////////////////////end...
app.use((req, res, next) => {
  res.status(404).json({
    error: "your request is not according to the url",
  });
});

app.use((req, res, next) => {
  res.status(200).json({
    message: "message is running on 3305",
  });
});

module.exports = app;
