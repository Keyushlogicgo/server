import express from "express";
import cors from "cors";
import { connectDb } from "./helper/connectDb.js";
import { join } from "path";
import * as route from "./router/index.js";
import { verifyUser } from "./middleware/verifyUser.js";
import { DATABASE_URL, PORT } from "./config/env.js";

const app = express();

// Static
app.use("/uploads", express.static(join(process.cwd(), "uploads")));

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded());

// Handle Client Server
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Public Routes
app.use("/api/auth", route.authRoute);
// Private Routes
app.use(verifyUser);

// Connect to MongoDB
connectDb(DATABASE_URL);

// Start server
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

// Uncaught exceptions and unhandled rejections
process.on("uncaughtException", function (err) {
  console.error("Uncaught Exception:", err.message);
});
process.on("unhandledRejection", function (err) {
  console.error("Unhandled Rejection:", err.message);
});
