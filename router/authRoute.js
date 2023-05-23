import express from "express";
import authController from "../controller/auth/authController.js";
import authValidate from "../validate/auth/authValidate.js";
import { verifyUser } from "../middleware/verifyUser.js";
import { allowRoles } from "../middleware/allowRoles.js";
import { userRole as Role } from "../helper/enum.js";

const route = express.Router();

route.post("/register", authValidate.register, authController.register);
route.post("/login", authValidate.login, authController.login);

// Private methods
route.patch(
  "/change-password",
  verifyUser,
  authValidate.changePassword,
  authController.changePassword
);
route.get(
  "/user",
  verifyUser,
  allowRoles([Role.ADMIN]),
  authController.getUser
);
route.delete(
  "/user/:userId",
  verifyUser,
  allowRoles([Role.ADMIN]),
  authController.delete
);

export default route;
