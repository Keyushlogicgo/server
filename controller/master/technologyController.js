import { errorResponse, successResponse } from "../../helper/apiResponse.js";
import { paginationFun } from "../../helper/common.js";
import { isExist } from "../../helper/isExist.js";
import TechnologyModel from "../../model/master/technologyModel.js";

class technologyController {
  static create = async (req, res) => {
    try {
      const doc = await TechnologyModel({
        title: req.body.title,
      });
      const result = await doc.save();
      return successResponse({
        res,
        statusCode: 201,
        data: result,
        message: "Technology created successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "create.Technology",
      });
    }
  };
  static get = async (req, res) => {
    const { id } = req.params;
    const { all } = req.query;

    try {
      let result, count;
      if (id) {
        await isExist(res, id, TechnologyModel);
        result = await TechnologyModel.findById(id);
      } else {
        const pagination = paginationFun(req.query);
        if (Boolean(all)) {
          result = await TechnologyModel.find().sort({ createdAt: -1 });
        } else {
          result = await TechnologyModel.find()
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
        }
        count = await TechnologyModel.estimatedDocumentCount();
      }
      return successResponse({
        res,
        statusCode: 200,
        data: result,
        count,
        message: "Technology fetched successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "get.Technology",
      });
    }
  };
  static delete = async (req, res) => {
    const { id } = req.params;
    try {
      if (id) {
        await isExist(res, id, TechnologyModel);
        await TechnologyModel.findByIdAndDelete(id);
      } else {
        const ids = req.query.ids.split(",");
        await TechnologyModel.deleteMany({ _id: { $in: ids } });
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
        funName: "delete.Technology",
      });
    }
  };
  static patch = async (req, res) => {
    const { id } = req.params;
    try {
      await isExist(res, id, TechnologyModel);
      const result = await TechnologyModel.findByIdAndUpdate(
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
        message: "Technology updated successfully",
      });
    } catch (error) {
      return errorResponse({
        res,
        error,
        funName: "patch.Technology",
      });
    }
  };
}
export default technologyController;
