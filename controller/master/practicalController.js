import { errorResponse, successResponse } from "../../helper/apiResponse.js";
import { paginationFun } from "../../helper/common.js";
import { userRole as Role } from "../../helper/enum.js";
import {
  handleFile,
  handleFileRemove,
  isValidURL,
} from "../../helper/fileUploading.js";
import { isExist } from "../../helper/isExist.js";
import PracticalModel from "../../model/master/practical.js";

class practicalController {
  static create = async (req, res) => {
    const { file } = req.body;
    try {
      const resumeUrl = await handleFile(file, "practical");
      req.body.file = resumeUrl;
      const doc = new PracticalModel(req.body);
      const result = await doc.save();

      return successResponse({
        res,
        statusCode: 201,
        data: result,
        message: "Practical created successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "create.practicalController",
      });
    }
  };
  static get = async (req, res) => {
    const { id } = req.params;
    const { technology, experienceLevel, all } = req.query;

    try {
      let result, count;
      if (req.user.role === Role.CANDIDATE) {
        result = await PracticalModel.findById(req.user.practical).select(
          "file -_id"
        );
      } else {
        let searchParams = {};
        if (experienceLevel) {
          searchParams.experienceLevel = experienceLevel;
        }
        if (technology) {
          searchParams.technology = technology;
        }
        if (Boolean(all)) {
          result = await PracticalModel.find(searchParams)
            .populate({
              path: "technology",
              select: "title ",
            })
            .sort({ createdAt: -1 });
        } else {
          const pagination = paginationFun(req.query);
          result = await PracticalModel.find(searchParams)
            .populate({
              path: "technology",
              select: "title ",
            })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
        }
        count = await PracticalModel.estimatedDocumentCount();
      }

      return successResponse({
        res,
        statusCode: 200,
        data: result,
        count,
        message: "Practical fetched successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "get.practicalController",
      });
    }
  };

  static delete = async (req, res) => {
    const { id } = req.params;
    try {
      if (id) {
        await isExist(res, id, PracticalModel);
        const { file } = await PracticalModel.findById(id).select("file");
        handleFileRemove(file, "practical");
        await PracticalModel.findByIdAndDelete(id);
      } else {
        const ids = req.query.ids.split(",");
        for (let i = 0; i < ids.length; i++) {
          const element = ids[i];

          const { file } = await PracticalModel.findById(element).select(
            "file"
          );
          handleFileRemove(file, "practical");
        }
        await PracticalModel.deleteMany({ _id: { $in: ids } });
      }

      return successResponse({
        res,
        statusCode: 200,
        message: "Document deleted successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "delete.practicalController",
      });
    }
  };

  static patch = async (req, res) => {
    const { id } = req.params;
    try {
      await isExist(res, id, PracticalModel);

      if (req.body.file && !isValidURL(req.body.file)) {
        const { file } = await PracticalModel.findById(id).select("file");
        handleFileRemove(file, "practical");

        const fileUrl = await handleFile(req.body.file, "practical");
        req.body.file = fileUrl;
      }

      const result = await PracticalModel.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return successResponse({
        res,
        statusCode: 200,
        data: result,
        message: "Practical updated successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "patch.practicalController",
      });
    }
  };
}
export default practicalController;
