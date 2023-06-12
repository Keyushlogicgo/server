import mongoose from "mongoose";

export const connectDb = async (url) => {
  try {
    mongoose.connect(url, { dbName: "hrms" });
    console.log("database connection established");
  } catch (error) {
    console.log("error: ", error);
  }
};
