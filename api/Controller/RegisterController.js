const Joi = require("joi");

const RegisterController = Joi.object({
  name: Joi.string().min(3).max(64).required(),

  password: Joi.string().required(),

  userType: Joi.string().required(),

  // access_token: [Joi.string(), Joi.number()],

  email: Joi.string()
    .required()
    .lowercase()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
});
module.exports = { RegisterController };
