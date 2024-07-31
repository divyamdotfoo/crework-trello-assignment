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
    const parsedData = createNewUserReqSchema.safeParse(rawData);

    if (!parsedData.success) {
      res.sendStatus(403);
      return;
    }

    const userData = await createUserAndSessionToken(parsedData.data);

    res.cookie("session_token", userData.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    });
    res.json({ id: userData.userId, name: userData.name });
  } catch (e) {
    if (e instanceof UserAlreadyExists) {
      res.sendStatus(403);
      return;
    }
    res.sendStatus(500);
  }
});

user.get("/checkSession", async (req, res) => {
  try {
    const cookie = req.cookies;
    const session_token = cookie.session_token;
    if (typeof session_token === "string") {
      const isSession = await validateToken(session_token);
      if (isSession.valid)
        res.send({
          name: isSession.name,
          id: isSession.userId,
        });
      else res.sendStatus(403);
    } else res.sendStatus(500);
  } catch (e) {}
});

user.post("/login", async (req, res) => {
  const rawData = req.body;
  const parsedData = loginUserRequestSchema.safeParse(rawData);
  if (!parsedData.success) {
    res.sendStatus(403);
    return;
  }
  const userData = await loginAndCreateToken(parsedData.data);
  if (!userData) {
    res.sendStatus(403);
    return;
  }
  res.cookie("session_token", userData?.token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: true,
  });
  res.json({ id: userData.userId, name: userData.name });
});

user.get("/logout", async (req, res) => {
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
  const tasks = await Task.find({ userId });
  res.send(tasks);
});
