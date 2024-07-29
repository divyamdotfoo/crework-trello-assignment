import { Router } from "express";
import { createNewUserReqSchema, loginUserRequestSchema } from "../zod";
import {
  createUserAndSessionToken,
  loginAndCreateToken,
  logoutUser,
  validateToken,
} from "../auth/controller";
import { UserAlreadyExists } from "../errors";
import { authMiddleware } from "../auth/middleware";
import { Task } from "../db/schema";

export const user = Router();

user.post("/create", async (req, res) => {
  try {
    const rawData = req.body;
    console.log(rawData);
    const parsedData = createNewUserReqSchema.safeParse(rawData);
    if (!parsedData.success) {
      res.sendStatus(403);
      return;
    }
    const sessionToken = await createUserAndSessionToken(parsedData.data);

    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    });

    res.send({ message: "user created" });
  } catch (e) {
    if (e instanceof UserAlreadyExists) {
      res.sendStatus(403);
    }
    console.log(e);
    res.sendStatus(500);
  }
});

user.get("/checkSession", async (req, res) => {
  try {
    const cookie = req.cookies;
    const session_token = cookie.session_token;
    if (typeof session_token === "string") {
      const isSession = await validateToken(session_token);
      if (isSession.valid) res.send({ isAuth: true });
    } else res.send({ isAuth: false });
  } catch (e) {}
});

user.post("/login", async (req, res) => {
  const rawData = req.body;
  const parsedData = loginUserRequestSchema.safeParse(rawData);
  if (!parsedData.success) {
    res.sendStatus(403);
    return;
  }
  const token = await loginAndCreateToken(parsedData.data);
  res.cookie("session_token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: true,
  });
  res.sendStatus(200);
});

user.post("/logout", async (req, res) => {
  const cookie = req.cookies;
  const session_token = cookie.session_token;
  if (typeof session_token === "string") {
    logoutUser(session_token);
  }
});

user.get("/tasks", authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (typeof userId !== "string") {
    res.sendStatus(403);
    return;
  }
  return Task.find({ userId });
});
