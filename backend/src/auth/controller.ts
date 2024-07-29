import { Session, User } from "../db/schema";
import { UserAlreadyExists } from "../errors";
import { LoginUserReqObject, NewUserReqObject } from "../zod";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

export const createUserAndSessionToken = async (
  userReqObj: NewUserReqObject
) => {
  const isUser = await User.findOne({ email: userReqObj.email });
  if (isUser) throw new UserAlreadyExists("email already exists");

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

export const loginAndCreateToken = async (
  data: LoginUserReqObject
): Promise<string | null> => {
  const isUser = await User.findOne({ email: data.email });
  if (!isUser) return null;
  const isPasswordSame = bcrypt.compareSync(data.password, isUser.password);
  if (!isPasswordSame) return null;

  const sessionToken = crypto.randomBytes(32).toString("hex");
  Session.create({
    token: sessionToken,
    userId: isUser._id as string,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return sessionToken;
};

export const validateToken = async (
  token: string
): Promise<{ valid: true; userId: string } | { valid: false }> => {
  const isTokenInDb = await Session.findOne({ token });
  if (!isTokenInDb) return { valid: false };
  const isExpired = isTokenInDb.expires - Date.now() < 0;
  if (isExpired) return { valid: false };
  return { valid: true, userId: isTokenInDb.userId };
};

export const logoutUser = async (token: string): Promise<boolean> => {
  try {
    await Session.deleteOne({ token });
    return true;
  } catch (e) {
    return false;
  }
};
