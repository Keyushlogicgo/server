import Joi from "joi";
import { validateResponse } from "../../helper/apiResponse.js";
import { validateMsg } from "../../helper/common.js";

const options = {
  abortEarly: false,
};

class technologyValidate {
  static create = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      title: Joi.string()
        .required()
        .label("title")
        .messages(validateMsg(null, null, "string")),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    next();
  };

  static patch = async (req, res, next) => {
    const validateSchema = Joi.object().keys({
      title: Joi.string()
        .empty()
        .label("title")
        .messages(validateMsg(null, null, "string")),
    });
    const { error } = validateSchema.validate(req.body, options);
    if (error) return validateResponse(res, error);

    next();
  };


}

export default technologyValidate;
