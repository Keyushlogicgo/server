import { validateResponse } from "../helper/apiResponse.js";

const errorObj = {
  details: [
    {
      path: "authorization",
      message: "You don't have permission to perform this action",
    },
  ],
};

// Define middleware function to check user roles
export const allowRoles = (roles) => {
  return (req, res, next) => {
    const userRoles = req.user.role;
    if (!roles.includes(userRoles)) {
      return validateResponse(res, errorObj);
    } else {
      next();
    }
  };
};
