import { CLIENT_BASE_URL } from "../../config/env.js";
import { errorResponse, successResponse } from "../../helper/apiResponse.js";
import { bcryptPassword } from "../../helper/bcryptPassword.js";
import { paginationFun } from "../../helper/common.js";
import { userRole as Role } from "../../helper/enum.js";
import {
  handleFile,
  handleFileRemove,
  isValidURL,
} from "../../helper/fileUploading.js";
import { isExist } from "../../helper/isExist.js";
import { generateToken, verifyToken } from "../../helper/jwtToken.js";
import { sendMail } from "../../helper/nodeMailer.js";
import AuthModel from "../../model/auth/authModel.js";

class authController {
  static register = async (req, res) => {
    const { email, password, username, image } = req.body;
    try {
      const hashPassword = await bcryptPassword(password);
      let document = {
        username: username,
        email: email,
        password: hashPassword,
      };
      if (image) {
        const imageUrl = await handleFile(image, "profile");
        document.image = imageUrl;
      }

      const doc = await AuthModel(document);
      const result = await doc.save();
      await sendMail({
        to: result.email,
        subject: "Welcome to virani Infotech",
        dynamicData: { email: result.username },
        filename: "welcome.html",
      });

      return successResponse({
        res,
        statusCode: 201,
        message: "User successfully registered",
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
        message: "User Login successfully",
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
  static forgotPassword = async (req, res) => {
    try {
      const token = await generateToken({ userId: req.user._id });
      const link = CLIENT_BASE_URL + "/reset-password/" + token;

      await sendMail({
        to: req.user.email,
        subject: "Password Reset Request",
        dynamicData: { email: req.user.email, link: link },
        filename: "forgotpassword.html",
      });
      return successResponse({
        res,
        statusCode: 200,
        message: "Reset password mail successfully send to your email address",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "login",
      });
    }
  };

  static patch = async (req, res) => {
    const { id } = req.params;
    try {
      if (req.body.image && !isValidURL(req.body.image)) {
        const { image } = await AuthModel.findById(id).select("image");
        handleFileRemove(image, "profile");

        const imageUrl = await handleFile(req.body.image, "profile");
        req.body.image = imageUrl;
      }
      var result;
      result = await AuthModel.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      result = result.toObject();
      delete result.password;

      return successResponse({
        res,
        statusCode: 200,
        message: "Profile updated successfully",
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
        message: "Change password successfully",
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
  static resetPassword = async (req, res) => {
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
        funName: "resetPassword",
      });
    }
  };
  static changeRole = async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await AuthModel.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      return successResponse({
        res,
        statusCode: 200,
        message: "Role Change successfully",
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
    const pagination = paginationFun(req.query);
    try {
      const result = await AuthModel.find()
        .skip(pagination.skip)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });
      const count = await AuthModel.estimatedDocumentCount();
      return successResponse({
        res,
        statusCode: 200,
        data: result,
        count,
        message: "Document fetched successfully",
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
    const { id } = req.params;
    try {
      const data = await isExist(res, id, AuthModel);
      let message;
      if (data.role === Role.ADMIN) {
        const token = await generateToken({ userId: data._id });
        const link = CLIENT_BASE_URL + "/confirm-delete/" + token;

        await sendMail({
          to: data.email,
          subject: "Account Deletion Confirmation",
          dynamicData: { email: data.email, link: link },
          filename: "confirmdelete.html",
        });
        message = "Please check mail inbox for confirm delete";
      } else {
        await AuthModel.findByIdAndDelete(id);
        message = "Document deleted successfully";
      }
      return successResponse({
        res,
        statusCode: 200,
        message,
        message: "Document deleted successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "getUser",
      });
    }
  };
  static confirmDelete = async (req, res) => {
    try {
      const { userId } = await verifyToken(req.params.token);

      await isExist(res, userId, AuthModel);

      await AuthModel.findByIdAndDelete(userId);
      return successResponse({
        res,
        statusCode: 200,
        message: "Document deleted successfully",
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
