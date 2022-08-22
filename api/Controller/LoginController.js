const Joi = require("joi");

const LoginController = Joi.object({
  password: Joi.string().required(),

  access_token: [Joi.string(), Joi.number()],

  email: Joi.string()
    .required()
    .lowercase()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
});
module.exports = { LoginController };
