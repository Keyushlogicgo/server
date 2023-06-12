import mongoose from "mongoose";
import { validateResponse } from "./apiResponse.js";

const errObj = {
  details: [
    {
      path: "data",
      message: "document not found",
    },
  ],
};

export const isExist = async (res, id, Model) => {
  const checkId = mongoose.Types.ObjectId.isValid(id);
  if (!checkId) return validateResponse(res, errObj);

  const result = await Model.findById(id);
  if (result === null) return validateResponse(res, errObj);

  return result;
};
