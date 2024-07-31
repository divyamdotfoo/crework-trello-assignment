import { z } from "zod";

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
export type LoginUserReqObject = z.infer<typeof loginUserRequestSchema>;

// tasks

export const createTaskReqSchema = z
  .object({
    title: z.string().max(150),
    description: z.string().optional(),
    status: z.enum(["todo", "completed", "inProgress", "underReview"]),
    priority: z.enum(["low", "medium", "urgent"]).optional(),
    deadline: z.number().optional(),
  })
  .passthrough();

export const editTaskReqSchema = createTaskReqSchema
  .partial()
  .extend({
    _id: z.string(),
  })
  .passthrough();

export const deleteTaskReqSchema = z.object({
  _id: z.string(),
});

export type TaskReqObj = z.infer<typeof createTaskReqSchema>;
export type EditReqObj = z.infer<typeof editTaskReqSchema>;
