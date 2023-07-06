import mongoose from "mongoose";

const mongooseSchema = mongoose.Schema(
  {
    reason: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
const reasonModel = mongoose.model("Reason", mongooseSchema);
export default reasonModel;
