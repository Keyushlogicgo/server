import mongoose from "mongoose";

const mongooseSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
const TechnologyModel = mongoose.model("Technology", mongooseSchema);
export default TechnologyModel;
