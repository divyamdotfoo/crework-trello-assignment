import { useTask } from "@/hooks/use-tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditor } from "@/hooks/use-editor";
import { useMemo, useState } from "react";
import { TaskPriority, TaskStatus } from "@/types";
import { Clock3 } from "lucide-react";
import { capitalize, getDate, getTimeSince } from "@/lib/utils";
import { DeleteTaskBtn } from "./btns";
import { motion } from "framer-motion";

export function TaskItem({ taskId }: { taskId: string }) {
  const { tasks } = useTask();
  const { setMode, setTask, setOpen } = useEditor();
  const [hover, setHover] = useState(false);

  const task = useMemo(
    () => tasks.find((t) => t._id === taskId),
    [tasks, taskId]
  );
  return (
    <div
      onMouseMove={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        setOpen(true);
        setMode("edit");
        if (task) {
          setTask(task);
        }
      }}
      className="relative bg-white border-border border rounded-md pl-4 pr-6 py-2"
    >
      {hover ? <DeleteTaskBtn taskId={taskId} /> : null}
      <p className=" text-blackAccent font-semibold pb-1">
        {capitalize(task?.title)}
      </p>
      <p className=" text-blackAccent text-xs pb-2">{task?.description}</p>
      {task?.priority && (
        <span
          className={` px-2 py-1 rounded-md font-light inline-block mb-3 text-white text-sm ${
            task.priority === TaskPriority.LOW
              ? " bg-low"
              : task.priority === TaskPriority.MEDIUM
              ? "bg-medium"
              : " bg-urgent"
          }`}
        >
          {capitalize(task.priority)}
        </span>
      )}

      {task?.deadline && (
        <p
          className={`flex items-center gap-2 text-blackAccent text-sm font-semibold pb-4${
            task.status && task.status === TaskStatus.Completed
              ? " line-through"
              : ""
          }`}
        >
          <Clock3 className=" w-4 h-4 text-blackAccent" />
          {getDate(task.deadline)}
        </p>
      )}

      {task?.createdAt && (
        <p className=" text-blackAccent text-xs font-medium">
          {getTimeSince(task.createdAt)}
        </p>
      )}
    </div>
  );
}

export function SortableTaskItem({ taskId }: { taskId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id: taskId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <motion.div
      animate={{
        rotateZ: isOver ? "-5deg" : "0deg",
        boxShadow: isOver
          ? "0 1rem 3rem rgba(0,0,0,0.2)"
          : "0 0.5rem 1rem rgba(0,0,0,0.1)",
        scale: isOver ? 1.05 : 1,
      }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskItem taskId={taskId} />
    </motion.div>
  );
}
