//VALIDATION
const Joi = require('@hapi/joi');

// Register Validation

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
          .min(6)
          .required(),
        email: Joi.string()
          .min(6)
          .required()
          .email(),
        password: Joi.string()
          .min(6)
          .required()
      });
      return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
          .min(6)
          .required()
          .email(),
        password: Joi.string()
          .min(6)
          .required()
      });
      return schema.validate(data);
}

// const tokenValidation = data => {
//   const schema = Joi.object({
//       user_id: Joi.string()
//         .required(),
//       token: Joi.string()
//         .required()
//     });
//     return schema.validate(data);
// }

// module.exports.tokenValidation = tokenValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
