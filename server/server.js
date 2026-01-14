import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoose from "mongoose";
const isProduction = process.env.NODE_ENV === "production";
const URI = isProduction
  ? process.env.MONGODB_URI
  : process.env.MONGODB_LOCAL_URI;
mongoose.connect(URI);
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN;
import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";

app.use(cookieParser());
app.use(helmet());

const corsOrigins = {
  local: [
    "http://localhost:5173",
    "http://localhost:3031",
    "http://localhost:4173",
    "http://localhost:4174",
  ],
  production: [
    `https://${DOMAIN}`,
    `https://www.${DOMAIN}`,
    `https://admin.${DOMAIN}`,
  ],
};

app.use(
  cors({
    origin: isProduction ? corsOrigins.production : corsOrigins.local,
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

app.listen(PORT, () => {
  console.log(`Server running Locally on http://localhost:${PORT}`);
});
