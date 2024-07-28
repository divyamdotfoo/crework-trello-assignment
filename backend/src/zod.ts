import { z } from "zod";

export const createNewUserReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(15),
  name: z.string(),
});

export type NewUserReqObject = z.infer<typeof createNewUserReqSchema>;
