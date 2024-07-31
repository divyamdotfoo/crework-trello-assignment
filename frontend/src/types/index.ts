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

// task
export const createTaskReqSchema = z.object({
  title: z.string().max(150),
  description: z.string().optional(),
  status: z.enum(["todo", "completed", "inProgress", "underReview"]),
  priority: z.enum(["low", "medium", "urgent"]).nullable(),
  deadline: z.number().optional(),
});

export const editTaskReqSchema = createTaskReqSchema.partial().extend({
  _id: z.string(),
});

export const deleteTaskReqSchema = z.object({
  id: z.string(),
});

export type CreateTaskReqObj = z.infer<typeof createTaskReqSchema>;
export type EditTaskReqObj = z.infer<typeof editTaskReqSchema>;

export type User = { id: string; name: string };

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  URGENT = "urgent",
}

export enum TaskStatus {
  ToDo = "todo",
  InProgress = "inProgress",
  UnderReview = "underReview",
  Completed = "completed",
}

export type Task = {
  title: string;
  _id: string;
  status: TaskStatus;
  createdAt: number;
  priority?: TaskPriority;
  deadline?: number;
  description?: string;
};

export type EditableTask = Partial<CreateTaskReqObj> & {
  _id?: string;
  createdAt?: number;
};
