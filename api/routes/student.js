const express = require("express");
const router = express.Router();
const Student = require("../model/student");
const mongoose = require("mongoose");
const verify_auth = require("../../middleware/verify_auth");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dxmuvzssp",
  api_key: "124624368865133",
  api_secret: "NcptYIHYQJ4WqEtb3b-U-xEDVsE",
});
// get
router.get("/", verify_auth, (req, res, next) => {
  Student.find()
    .then((result) => {
      res.status(200).json({
        studentData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// post
// const fileStorageEngine = multer.diskStorage({
//   destination: "uploads",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "--" + file.originalname);
//   },
// });
// const upload = multer({ storage: fileStorageEngine }).single("testImage");
// router.post("/", (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const student = new Student({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         gender: req.body.gender,
//         image: {
//           data: req.file.filename,
//           contentType: "image/png",
//         },
//       });
//       student
//         .save()
//         .then((results) => {
//           console.log(results);
//           res.status(200).json({
//             newStudent: results,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//           res.status(500).json({
//             error: err,
//           });
//         });
//     }
//   });
// });
router.post("/", (req, res, next) => {
  const file = req.files.img;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      img: result.url,
    });
    student
      .save()
      .then((results) => {
        console.log(results);
        res.status(200).json({
          newStudent: results,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
});
// get_by_id
router.get("/:id", (req, res, next) => {
  Student.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        student: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
//   delete
router.delete("/:id", (req, res, next) => {
  Student.remove({ _id: req?.params?.id })
    .then((result) => {
      res.status(200).json({
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// put
router.put("/:id", (req, res, next) => {
  Student.findOneAndUpdate(
    { _id: req?.params?.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        updated_dataL: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
