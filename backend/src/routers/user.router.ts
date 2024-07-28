import { Router } from "express";
import { createNewUserReqSchema } from "../zod";
import { createUserAndSessionToken } from "../auth/controller";

export const user = Router();

user.post("/create", async (req, res) => {
  try {
    const rawData = req.body;
    console.log("raw", rawData);
    const parsedData = createNewUserReqSchema.safeParse(rawData);
    if (!parsedData.success) {
      console.log("error");
      res.send("ok");
      return;
    }
    console.log(parsedData);
    const sessionToken = await createUserAndSessionToken(parsedData.data);
    res.send(sessionToken);
  } catch (e) {
    console.log(e);
  }
});

// user.post("/checkSession");

// user.post("/login");

// user.post("/logout");

// user.post("/delete");

// user.get("/board");
