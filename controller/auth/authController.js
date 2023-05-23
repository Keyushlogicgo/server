import { errorResponse, successResponse } from "../../helper/apiResponse.js";
import { bcryptPassword } from "../../helper/bcryptPassword.js";
import { isExist } from "../../helper/isExist.js";
import { generateToken } from "../../helper/jwtToken.js";
import AuthModel from "../../model/auth/authModel.js";

class authController {
  static register = async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashPassword = await bcryptPassword(password);
      const doc = await AuthModel({
        email: email,
        password: hashPassword,
      });
      const result = await doc.save();
      return successResponse({
        res,
        statusCode: 201,
        message: "User  successfully registered",
        data: result,
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "register",
      });
    }
  };

  static login = async (req, res) => {
    try {
      const token = await generateToken({ userId: req.user._id });
      const result = {
        token: token,
        user: req.user,
      };
      return successResponse({
        res,
        statusCode: 200,
        message: "User  Login successfully",
        data: result,
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "login",
      });
    }
  };

  static changePassword = async (req, res) => {
    const { password } = req.body;
    try {
      const hashPassword = await bcryptPassword(password);
      const result = await AuthModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: { password: hashPassword },
        },
        { new: true }
      );
      return successResponse({
        res,
        statusCode: 200,
        message: "Reset password successfully",
        data: result,
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "changePassword",
      });
    }
  };

  static getUser = async (req, res) => {
    try {
      const result = await AuthModel.find();
      return successResponse({
        res,
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "getUser",
      });
    }
  };
  static delete = async (req, res) => {
    const { userId } = req.params;
    try {
      await isExist(res, userId, AuthModel);
      const result = await AuthModel.findByIdAndDelete(userId);
      return successResponse({
        res,
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "getUser",
      });
    }
  };
}
export default authController;
