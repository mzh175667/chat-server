const jwt = require("jsonwebtoken");
const User = require("../api/model/user");
module.exports = (req, res, next) => {
  // try {
  // const token = req.headers.authorization.split(" ")[1]; // this is for removing bearer;
  const token = req.headers.authorization;
  jwt.verify(token, "this is dummy text", (err, payload) => {
    if (err) {
      res.status(401).json({
        message: "unauthorized",
      });
    }
    // console.log("payload", payload);
    const { _id } = payload;
    console.log(_id);
    User.findById(_id).then((userData) => {
      // console.log("userData", userData);
      req.user = userData;
      next();
    });
    // if (payload.userType === "client") {
    //   next();
    // } else {
    //   return res.status(401).json({
    //     message: "only client is valid",
    //   });
    // }
  });
};
