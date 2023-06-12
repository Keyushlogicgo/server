import Joi from "joi";
import { validateMsg } from "../../helper/common.js";
import { validateResponse } from "../../helper/apiResponse.js";
import AuthModel from "../../model/auth/authModel.js";
import { comparePasswords } from "../../helper/bcryptPassword.js";
import { userRole as Role } from "../../helper/enum.js";
import { verifyToken } from "../../helper/jwtToken.js";

const options = {
  abortEarly: false,
};

class authValidate {
  static register = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      email: Joi.string()
        .required()
        .label("email")
        .email()
        .messages(validateMsg(null, null, "string")),
      username: Joi.string()
        .required()
        .label("username")
        .messages(validateMsg(null, null, "string")),
      image: Joi.string()
        .label("image")
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
  static changeRole = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      role: Joi.string()
        .required()
        .valid(Role.ADMIN, Role.CANDIDATE, Role.EMPLOYEE, Role.HR)
        .label("role")
        .messages(validateMsg(null, null, "role")),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    next();
  };
  static patch = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      image: Joi.string()
        .empty()
        .label("image")
        .messages(validateMsg(null, null, "image")),
      username: Joi.string()
        .empty()
        .label("username")
        .messages(validateMsg(null, null, "username")),
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
    let user = await AuthModel.findOne({ email: email });
    if (!user) return validateResponse(res, errObj);

    const verifyPassword = await comparePasswords(password, user.password);
    if (!verifyPassword) return validateResponse(res, errObj);

    user = user.toObject();
    delete user.password;
    req.user = user;
    next();
  };

  static forgotPassword = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      email: Joi.string()
        .required()
        .label("email")
        .messages(validateMsg(null, null, "string")),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    const errObj = {
      details: [
        {
          path: "email",
          message: "user with this email dose not exist",
        },
      ],
    };
    let user = await AuthModel.findOne({ email: req.body.email });

    if (!user) return validateResponse(res, errObj);

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
  static resetPassword = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      password: Joi.string()
        .required()
        .label("password")
        .invalid(Joi.ref("old_password"))
        .messages(validateMsg(null, null, "string")),
      confirm_password: Joi.string().valid(Joi.ref("password")).required(),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    const { token } = req.params;
    const checkToken = await verifyToken(token);
    const errObj = {
      details: [
        {
          path: "authorization",
          message: "Authorization credential ware not found or invalid",
        },
      ],
    };
    if (!checkToken) return validateResponse(res, errObj);
    const user = await AuthModel.findById(checkToken.userId);
    req.user = user;

    next();
  };
}

export default authValidate;
