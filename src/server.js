import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
config();

import connectDb from "./config/database.js";
import adminRouter from "./routes/adminRoutes.js";
import agentRouter from "./routes/agentRoutes.js";

connectDb();
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Access-Control-Allow-Credentials"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRouter);
app.use("/agent", agentRouter);

const port = 4000;

app.listen(port, () => {
  console.log(`server started running on port ${port}`);
});
