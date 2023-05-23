import mongoose from "mongoose";

export const connectDb = async (url) => {
  try {
    mongoose.connect(url);
    console.log("database connection established");
  } catch (error) {
    console.log("error: ", error);
  }
};
