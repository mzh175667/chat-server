const express = require("express");
const router = express.Router();
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });
router.post("/", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("ok ");
});
module.exports = router;
