import mongoose from "mongoose";

const mongooseSchema = mongoose.Schema(
  {
    count: { type: Number, required: true },
    time: { type: Date, required: true, default: new Date() },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const failAttemptModel = mongoose.model("FailAttempt", mongooseSchema);
export default failAttemptModel;
