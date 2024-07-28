import { Session, User } from "../db/schema";
import { NewUserReqObject } from "../zod";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

export const createUserAndSessionToken = async (
  userReqObj: NewUserReqObject
) => {
  const isUser = await User.findOne({ email: userReqObj.email });
  if (isUser) throw new Error("email already exists");

  const hashedPassword = await bcrypt.hash(userReqObj.password, 10);
  const user = new User({
    name: userReqObj.name,
    email: userReqObj.email,
    password: hashedPassword,
  });

  const sessionToken = crypto.randomBytes(32).toString("hex");

  const session = new Session({
    token: sessionToken,
    userId: user._id as string,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await Promise.all([user.save(), session.save()]);
  return sessionToken;
};

export const login = () => {
  // verify email and password
  // creating and sending session token to the browser
};

export const logout = () => {
  // deleting session token
};
