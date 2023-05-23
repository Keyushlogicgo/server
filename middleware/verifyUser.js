import { errorResponse, validateResponse } from "../helper/apiResponse.js";
import { verifyToken } from "../helper/jwtToken.js";
import AuthModel from "../model/auth/authModel.js";

const errObj = {
  details: [
    {
      path: "Token",
      message: "Authorization credential ware not found or invalid",
    },
  ],
};

export const verifyUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return validateResponse(res, errObj);
    if (!authorization.startsWith("Bearer "))
      return validateResponse(res, errObj);

    const { userId } = await verifyToken(authorization.split(" ")[1]);
    const user = (await AuthModel.findById(userId)).toObject();
    if (!user) return validateResponse(res, errObj);

    delete user.password;
    req.user = user;

    next();
  } catch (error) {
    return errorResponse({ res, error });
  }
};
