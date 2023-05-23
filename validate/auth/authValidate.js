import Joi from "joi";
import { validateMsg } from "../../helper/common.js";
import { validateResponse } from "../../helper/apiResponse.js";
import AuthModel from "../../model/auth/authModel.js";
import { comparePasswords } from "../../helper/bcryptPassword.js";

const options = {
  abortEarly: false,
};

class authValidate {
  static register = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      email: Joi.string()
        .required()
        .label("email")
        .messages(validateMsg(null, null, "string")),
      password: Joi.string()
        .required()
        .label("password")
        .messages(validateMsg(null, null, "string")),
      confirm_password: Joi.string().valid(Joi.ref("password")).required(),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    next();
  };

  static login = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      email: Joi.string()
        .required()
        .label("email")
        .messages(validateMsg(null, null, "string")),
      password: Joi.string()
        .required()
        .label("password")
        .messages(validateMsg(null, null, "string")),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    const { email, password } = req.body;
    const errObj = {
      details: [
        {
          path: "email",
          message: "invalid user credentials",
        },
      ],
    };
    const user = (await AuthModel.findOne({ email: email })).toObject();
    if (!user) return validateResponse(res, errObj);

    const verifyPassword = await comparePasswords(password, user.password);
    if (!verifyPassword) return validateResponse(res, errObj);

    delete user.password;
    req.user = user;
    next();
  };

  static changePassword = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      old_password: Joi.string()
        .required()
        .label("old_password")
        .messages(validateMsg(null, null, "string")),
      password: Joi.string()
        .required()
        .label("password")
        .invalid(Joi.ref("old_password"))
        .messages(validateMsg(null, null, "string")),
      confirm_password: Joi.string().valid(Joi.ref("password")).required(),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    const { password } = await AuthModel.findById(req.user._id).select(
      "password"
    );
    const verifyPassword = await comparePasswords(
      req.body.old_password,
      password
    );

    const errObj = {
      details: [
        {
          path: "old_password",
          message: "old password is incorrect",
        },
      ],
    };
    if (!verifyPassword) return validateResponse(res, errObj);

    next();
  };
}

export default authValidate;
