import express from "express";
import technologyController from "../../controller/master/technologyController.js";
import technologyValidate from "../../validate/master/technologyValidate.js";
import { allowRoles } from "../../middleware/allowRoles.js";
import { userRole as Role } from "../../helper/enum.js";
const route = express.Router();

route.post(
  "/",
  allowRoles([Role.ADMIN, Role.HR]),
  technologyValidate.create,
  technologyController.create
);
route.get(
  "/:id?",
  allowRoles([Role.ADMIN, Role.HR, Role.EMPLOYEE, Role.ASO]),
  technologyController.get
);
route.delete(
  "/:id?",
  allowRoles([Role.ADMIN, Role.HR]),

  technologyController.delete
);
route.patch(
  "/:id",
  allowRoles([Role.ADMIN, Role.HR]),
  technologyValidate.patch,
  technologyController.patch
);

export default route;
