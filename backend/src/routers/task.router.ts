import { Router } from "express";
import { authMiddleware } from "../auth/middleware";
import {
  createTaskReqSchema,
  deleteTaskReqSchema,
  editTaskReqSchema,
  TaskReqObj,
} from "../zod";
import { Task } from "../db/schema";

export const task = Router();

task.use("/", authMiddleware);

task.post("/create", async (req, res) => {
  try {
    const userId = req.userId;
    const rawData = req.body;
    const parsedData = createTaskReqSchema.safeParse(rawData);

    if (!parsedData.success || typeof userId !== "string") {
      res.sendStatus(403);
      return;
    }

    const task = await createTask(parsedData.data, userId);
    res.send(task);
  } catch (e) {
    res.sendStatus(500);
  }
});

task.put("/edit", async (req, res) => {
  try {
    const rawData = req.body;
    const parsedData = editTaskReqSchema.safeParse(rawData);
    if (!parsedData.success) {
      res.sendStatus(403);

      return;
    }
    const { _id, ...toUpdate } = parsedData.data;
    await Task.updateOne({ _id }, { ...toUpdate });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

task.delete("/delete", async (req, res) => {
  try {
    const rawData = req.body;
    const parsedData = deleteTaskReqSchema.safeParse(rawData);
    if (!parsedData.success) {
      res.sendStatus(403);
      return;
    }
    await Task.deleteOne({ _id: parsedData.data?._id });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

const createTask = async (data: TaskReqObj, userId: string) => {
  const newTask = await Task.create({
    userId,
    title: data.title,
    description: data.description,
    deadline: data.deadline,
    status: data.status,
    priority: data.priority,
  });
  return { ...data, _id: newTask._id as string };
};
