import express from "express";
import authController from "../../controller/auth/authController.js";
import authValidate from "../../validate/auth/authValidate.js";
import { verifyUser } from "../../middleware/verifyUser.js";
import { allowRoles } from "../../middleware/allowRoles.js";
import { userRole as Role } from "../../helper/enum.js";

const route = express.Router();

route.post("/register", authValidate.register, authController.register);
route.post("/login", authValidate.login, authController.login);
route.delete("/admin/:token", authController.confirmDelete);

route.post(
  "/forgot-password",
  authValidate.forgotPassword,
  authController.forgotPassword
);
route.patch(
  "/reset-password/:token",
  authValidate.resetPassword,
  authController.resetPassword
);

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
  allowRoles([Role.ADMIN, Role.HR]),
  authController.getUser
);
route.delete(
  "/user/:id?",
  verifyUser,
  allowRoles([Role.ADMIN, Role.HR]),
  authController.delete
);
route.patch("/user/:id?", verifyUser, authValidate.patch, authController.patch);

route.patch(
  "/user/role/:userId",
  verifyUser,
  allowRoles([Role.ADMIN, Role.HR]),
  authValidate.changeRole,
  authController.changeRole
);

export default route;
