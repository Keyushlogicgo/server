import mongoose from "mongoose";
import { userRole as Role } from "../../helper/enum.js";

const mongooseSchema = mongoose.Schema(
  {
    image: { type: String, trim: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: Role.EMPLOYEE },
  },
  { timestamps: true }
);
const AuthModel = mongoose.model("User", mongooseSchema);
export default AuthModel;
