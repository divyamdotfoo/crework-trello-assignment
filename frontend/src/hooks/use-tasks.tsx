import { API, fetcher } from "@/fetcher";
import { Task, TaskStatus } from "@/types";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

interface TaskContextType {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  items: Record<TaskStatus, string[]>;
  setItems: Dispatch<SetStateAction<Record<TaskStatus, string[]>>>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<TaskStatus, string[]>>({
    completed: [],
    inProgress: [],
    todo: [],
    underReview: [],
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(false);

  const separateTaskIdByStatus = (
    tasks: Task[]
  ): Record<TaskStatus, string[]> =>
    tasks.reduce((prev, curr) => {
      if (!prev[curr.status]) {
        prev[curr.status] = [];
      }
      prev[curr.status].push(curr._id);
      return prev;
    }, {} as Record<TaskStatus, string[]>);

  useEffect(() => {
    if (tasks.length) {
      setItems((prev) => ({ ...prev, ...separateTaskIdByStatus(tasks) }));
    }
  }, [tasks]);

  useEffect(() => {
    async function getTasks() {
      setLoading(true);
      const res = await fetcher<Task[]>(API.user.getTasks);
      setLoading(false);
      if (res.status === "failed") {
        return;
      }
      setTasks(res.data);
      console.log(res.data);
      setItems((prev) => ({ ...prev, ...separateTaskIdByStatus(res.data) }));
    }
    getTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ items, loading, setItems, setTasks, tasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("wrap it");
  return context;
};
