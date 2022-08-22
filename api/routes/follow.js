const express = require("express");
const verify_auth = require("../../middleware/verify_auth");
const router = express.Router();
const User = require("../model/user");
router.put("/follow", verify_auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      // console.log("result", result);
      if (err) {
        return res.status(422).json({
          error: err,
        });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .then((result) => {
          res.status(200).json({
            result: result,
            success: true,
          });
        })
        .catch((err) => {
          res.status(422).json({
            error: err,
          });
        });
    }
  );
});
router.put("/unfollow", verify_auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unFollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({
          error: err,
        });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unFollowId },
        },
        {
          new: true,
        }
      )
        .then((result) => {
          res.status(200).json({
            result: result,
          });
        })
        .catch((err) => {
          res.status(422).json({
            error: err,
          });
        });
    }
  );
});

module.exports = router;
