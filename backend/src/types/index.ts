import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tasks: string[];
}

export interface ISession extends Document {
  token: string;
  userId: string;
  expires: number;
}

export interface ITask extends Document {
  userId: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
  description?: string;
  priority?: TaskPriority;
  deadline?: number;
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  URGENT = "urgent",
}

export enum TaskStatus {
  ToDo = "todo",
  InProgress = "in-progress",
  UnderReview = "under-review",
  Completed = "completed",
}
