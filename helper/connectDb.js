import mongoose from "mongoose";

export const connectDb = (url) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed");
    });
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
};
