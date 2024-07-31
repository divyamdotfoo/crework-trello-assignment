import { useTask } from "@/hooks/use-tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditor } from "@/hooks/use-editor";
import { useMemo } from "react";
import { TaskPriority } from "@/types";
import { Clock3 } from "lucide-react";
import { capitalize, getDate, getTimeSince } from "@/lib/utils";

export function TaskItem({ taskId }: { taskId: string }) {
  const { tasks } = useTask();
  const { setMode, setTask, setOpen } = useEditor();

  const task = useMemo(
    () => tasks.find((t) => t._id === taskId),
    [tasks, taskId]
  );
  return (
    <div
      onClick={(e) => {
        setOpen(true);
        setMode("edit");
        if (task) {
          setTask(task);
        }
      }}
      className=" bg-white border-border border rounded-md px-4 py-2"
    >
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
        <p className=" flex items-center gap-2 text-blackAccent text-sm font-semibold pb-4 ">
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: taskId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      onClick={() => console.log("clicked")}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskItem taskId={taskId} />
    </div>
  );
}
