import { API, fetcher } from "@/fetcher";
import { useEditor } from "@/hooks/use-editor";
import { useTask } from "@/hooks/use-tasks";
import {
  createTaskReqSchema,
  EditableTask,
  editTaskReqSchema,
  Task,
  TaskStatus,
} from "@/types";
import { Plus } from "lucide-react";
import { RadixTrash } from "./svgs";
import { motion } from "framer-motion";

export function CreateNewTaskBtn({
  data,
  onSuccess,
  onError,
}: {
  data: EditableTask;
  onSuccess: () => void;
  onError?: () => void;
}) {
  const { setTasks } = useTask();
  const handler = async () => {
    const parsedData = createTaskReqSchema.safeParse(data);
    if (!parsedData.success) {
      return;
    }
    const res = await fetcher<Task>(API.task.create, {
      method: "POST",
      body: JSON.stringify(parsedData.data),
    });
    if (res.status === "failed") {
      return;
    }
    setTasks((p) => [...p, res.data]);
    onSuccess();
  };
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      whileHover={{ scale: 1.01 }}
      disabled={!data.title || !data.status}
      onClick={handler}
      className="bg-bluePrimary disabled:cursor-not-allowed disabled:opacity-70 text-white py-2 flex items-center justify-center w-full rounded-md"
    >
      Add task
    </motion.button>
  );
}

export function EditTaskBtn({
  data,
  onSuccess,
  onError,
}: {
  data: EditableTask;
  onSuccess: () => void;
  onError?: () => void;
}) {
  const { setTasks } = useTask();
  const handler = async () => {
    const parsedData = editTaskReqSchema.safeParse(data);
    if (!parsedData.success) {
      return;
    }
    const res = await fetcher<unknown>(API.task.edit, {
      method: "PUT",
      body: JSON.stringify(parsedData.data),
    });
    if (res.status === "failed") {
      return;
    }
    setTasks((prev) => {
      return [
        ...prev.filter((t) => t._id !== parsedData.data._id),
        parsedData.data as Task,
      ];
    });
    onSuccess();
  };
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      whileHover={{ scale: 1.01 }}
      onClick={handler}
      className="bg-bluePrimary disabled:cursor-not-allowed disabled:opacity-70 text-white py-2 flex items-center justify-center w-full rounded-md"
    >
      Edit task
    </motion.button>
  );
}

export function OpenNewTaskSheet({
  variant,
  children,
  classname,
}: {
  variant: "none" | TaskStatus;
  children?: React.ReactNode;
  classname?: string;
}) {
  const { setOpen, setTask, setMode } = useEditor();
  const handler = () => {
    setOpen(true);
    setMode("add");
    if (variant === "none") {
      setTask({});
      return;
    }
    switch (variant) {
      case TaskStatus.ToDo:
        setTask({ status: "todo" });
        return;
      case TaskStatus.Completed:
        setTask({ status: "completed" });
        return;
      case TaskStatus.InProgress:
        setTask({ status: "inProgress" });
        return;
      case TaskStatus.UnderReview:
        setTask({ status: "underReview" });
        return;
      default:
        setTask({});
    }
  };

  if (variant === "none") {
    return (
      <motion.button
        whileTap={{ scale: 0.99 }}
        whileHover={{ scale: 1.01 }}
        onClick={handler}
        className={`px-2 py-1 rounded-md shadow-sm shadow-black/50 bg-bluePrimary text-white ${classname}`}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      whileHover={{ scale: 1.01 }}
      onClick={handler}
      className=" bg-gradient-to-b from-blackMuted to-blackSecondary text-white rounded-md px-2 py-2 flex items-center justify-between"
    >
      <span>Add new</span>
      <Plus className=" w-4 h-4 text-white" />
      {children}
    </motion.button>
  );
}

export function DeleteTaskBtn({ taskId }: { taskId: string }) {
  const { setTasks } = useTask();

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      whileHover={{ scale: 1.01 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setTasks((p) => p.filter((task) => task._id !== taskId));
        fetcher(API.task.delete, {
          method: "DELETE",
          body: JSON.stringify({ _id: taskId }),
        });
      }}
      className=" absolute top-2 right-2 w-5 h-5 text-red-400 hover:scale-110 transition-all"
    >
      <RadixTrash />
    </motion.button>
  );
}
