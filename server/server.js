import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoose from "mongoose";
const URI =
  process.env.NODE_ENV === "production"
    ? process.env.MongoDB_URI
    : process.env.MongoDB_LOCAL_URI;
mongoose.connect(URI);
const port = process.env.PORT || 3000;
import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";

app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: [
      // local Development
      "http://localhost:5173",
      "http://localhost:3030",
      // local Builds
      "http://localhost:4173",
      "http://localhost:4174",
      // Production Sites
      "https://shopwithfurqan.com",
      "https://admin.shopwithfurqan.com",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/", usersRouter);
app.use("/admin", adminRouter);

app.use((req, res) => {
  res.status(404);
});

app.listen(port, () => {
  console.log(`Server running Locally on http://localhost:${port}`);
});
