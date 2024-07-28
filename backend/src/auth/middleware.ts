import { Request, Response, NextFunction } from "express";
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // verifying session token and sending appropriate response
};
