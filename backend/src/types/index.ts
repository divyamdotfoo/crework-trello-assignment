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
  description?: string;
  status: TaskStatus;
}

export enum TaskStatus {
  ToDo = "todo",
  InProgress = "in-progress",
  UnderReview = "under-review",
  Completed = "completed",
}
