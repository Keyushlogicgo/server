import { errorResponse, successResponse } from "../../helper/apiResponse.js";
import { paginationFun } from "../../helper/common.js";
import { isExist } from "../../helper/isExist.js";
import ReasonModel from "../../model/master/reasonModel.js";

class reasonController {
  static create = async (req, res) => {
    try {
      const doc = await ReasonModel({
        reason: req.body.reason,
      });
      const result = await doc.save();
      return successResponse({
        res,
        statusCode: 201,
        data: result,
        message: "Reason created successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "create.Reason",
      });
    }
  };
  static get = async (req, res) => {
    const { id } = req.params;
    const { all } = req.query;

    try {
      let result, count;
      if (id) {
        await isExist(res, id, ReasonModel);
        result = await ReasonModel.findById(id);
      } else {
        const pagination = paginationFun(req.query);
        if (Boolean(all)) {
          result = await ReasonModel.find().sort({ createdAt: -1 });
        } else {
          result = await ReasonModel.find()
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
        }
        count = await ReasonModel.estimatedDocumentCount();
      }
      return successResponse({
        res,
        statusCode: 200,
        data: result,
        count,
        message: "Reason fetched successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "get.Reason",
      });
    }
  };
  static delete = async (req, res) => {
    const { id } = req.params;
    try {
      if (id) {
        await isExist(res, id, ReasonModel);
        await ReasonModel.findByIdAndDelete(id);
      } else {
        const ids = req.query.ids.split(",");
        await ReasonModel.deleteMany({ _id: { $in: ids } });
      }
      return successResponse({
        res,
        statusCode: 200,
        message: "Documents deleted successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "delete.Reason",
      });
    }
  };
  static patch = async (req, res) => {
    const { id } = req.params;
    try {
      await isExist(res, id, ReasonModel);
      const result = await ReasonModel.findByIdAndUpdate(
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
        message: "Reason updated successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "patch.Reason",
      });
    }
  };
}
export default reasonController;
