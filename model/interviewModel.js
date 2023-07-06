import mongoose from "mongoose";
import { userRole as Role, hiringStatus, status } from "../../helper/enum.js";

const mongooseSchema = mongoose.Schema(
  {
    resume: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: Number, required: true },
    ctc: { type: Number, required: true },
    etc: { type: Number, required: true },
    technology: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Technology",
    },
    experienceLevel: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
    status: {
      type: String,
      enum: [status.PENDING, status.COMPLETED, status.CANCELED],
      default: status.PENDING,
    },
    hiringStatus: {
      type: String,
      enum: [hiringStatus.PENDING, hiringStatus.HIRED, hiringStatus.REJECTED],
      default: status.PENDING,
    },
    practicalStatus: {
      type: String,
      enum: [status.PENDING, status.COMPLETED, status.CANCELED],
      default: status.PENDING,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paperset: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Paper",
    },
    practical: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Practical",
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    offredAmount: {
      type: Number,
      trim: true,
    },
    salarySlip: [
      {
        type: String,
        trim: true,
      },
    ],
    password: { type: String, required: true },
    role: { type: String, required: true, default: Role.CANDIDATE },
  },
  { timestamps: true }
);
const interviewModel = mongoose.model("Interview", mongooseSchema);
export default interviewModel;
