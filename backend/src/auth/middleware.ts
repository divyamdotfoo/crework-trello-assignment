import { Request, Response, NextFunction } from "express";
import { validateToken } from "./controller";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = req.cookies;
  const session_token = cookie.session_token;
  if (typeof session_token === "string") {
    const isValid = await validateToken(session_token);
    if (isValid.valid) {
      req.userId = isValid.userId;
      next();
    }
  } else {
    res.sendStatus(403);
  }
};
