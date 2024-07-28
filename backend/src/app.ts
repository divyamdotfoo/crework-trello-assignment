import express from "express";
import { user } from "./routers/user.router";
const app = express();
app.use(express.json());

app.use("/user", user);

app.get("/hello", (req, res) => {
  res.send("hello there");
});

export default app;
