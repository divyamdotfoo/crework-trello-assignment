import express from "express";
import { user } from "./routers/user.router";
import { task } from "./routers/task.router";
import cookieParser from "cookie-parser";
import helmet from "helmet";
const app = express();
app.use(cookieParser());

// for development
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(express.static("out"));

app.use(helmet());
app.use(express.json());

app.use("/api/user", user);
app.use("/api/task", task);

export default app;
