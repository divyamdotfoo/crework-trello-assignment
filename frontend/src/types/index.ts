import { z } from "zod";
export type useAuthData = { isAuth: boolean };

export const createNewUserReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(30),
  name: z.string(),
});
export const loginUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(30),
});

export type NewUserReqObject = z.infer<typeof createNewUserReqSchema>;

// task
export const createTaskReqSchema = z.object({
  title: z.string().max(150),
  description: z.string().nullable(),
  status: z.enum(["todo", "completed", "in-progress", "under-review"]),
  priority: z.enum(["low", "medium", "urgent"]).nullable(),
  deadline: z.number().nullable(),
});

export const editTaskReqSchema = createTaskReqSchema.partial().extend({
  id: z.string(),
});

export const deleteTaskReqSchema = z.object({
  id: z.string(),
});

export type Task = z.infer<typeof createTaskReqSchema> & { _id: string };
export type CreateTaskReqObj = z.infer<typeof createTaskReqSchema>;
export type EditTaskReqObj = z.infer<typeof editTaskReqSchema>;
