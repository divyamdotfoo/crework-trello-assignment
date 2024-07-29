// this is to extend the request object with a userId field
// this will make it easy to use the userId for querys and make the application more typesafe

import { Request } from "express";

declare global {
  namespace Express {
    interface Request extends Request {
      userId?: string;
    }
  }
}
