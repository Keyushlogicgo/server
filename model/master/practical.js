import mongoose from "mongoose";

const mongooseSchema = mongoose.Schema(
  {
    technology: {
      type: String,
      required: true,
      ref: "Technology",
    },
    experienceLevel: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
    file: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
const PracticalModel = mongoose.model("Practical", mongooseSchema);
export default PracticalModel;
