const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../model/user");
const mongoose = require("mongoose");
const { RegisterController } = require("../Controller/RegisterController");
const { LoginController } = require("../Controller/LoginController");
const jwt = require("jsonwebtoken");

// post
router.post("/register", async (req, res, next) => {
  const { error } = RegisterController.validate(req.body);
  if (error) {
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    // _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    userType: req.body.userType,
    password: hashedPassword,
  });

  const Token = jwt.sign(
    {
      name: user.name,
      userType: user.userType,
      email: user.email,
      _id: user._id,
    },
    "this is dummy text",
    {
      expiresIn: "24h",
    }
  );
  user
    .save()
    .then((result) => {
      res.status(200).json({
        newUser: result,
        message: "Data stored successfully",
        success: true,
        // token: Token,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/login", (req, res, next) => {
  const { error } = LoginController.validate(req.body);
  if (error) {
    return res.send(error);
  }
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "user not found",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({
            message: "email or password is wrong",
            success: false,
          });
        } else {
          const Token = jwt.sign(
            {
              name: user[0].name,
              userType: user[0].userType,
              email: user[0].email,
              _id: user[0]._id,
            },
            "this is dummy text",
            {
              expiresIn: "24h",
            }
          );
          console.log(user);
          res.status(200).json({
            name: user[0].name,
            userType: user[0].userType,
            email: user[0].email,
            _id: user[0]._id,
            token: Token,
            success: true,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.get("/", (req, res, next) => {
  User.find()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        userData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// router.get("/", async (req, res, next) => {
//   const userId = req.query.userId;
//   const name = req.query.name;
//   try {
//     const user = userId
//       ? await User.findById(userId)
//       : await User.findOne({ name: name });
//     console.log("user._doc", user._doc);
//     const { password, ...other } = user._doc;
//     res.status(200).json(other);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
// get users by id....
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        friend: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.get("/follow/:id", (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .populate("followers")
    .then((result) => {
      res.status(200).json({
        friend: result,
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.get("/following/:id", (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .populate("following")
    .then((result) => {
      res.status(200).json({
        friend: result,
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
