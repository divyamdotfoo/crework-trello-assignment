import { CreateNewTaskBtn, EditTaskBtn } from "@/components/btns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import {
  CreateTaskReqObj,
  EditableTask,
  TaskPriority,
  TaskStatus,
} from "@/types";
import {
  Calendar,
  Loader,
  Maximize2,
  Pen,
  Share2,
  SquareActivityIcon,
  Star,
  X,
} from "lucide-react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface EditorContextType {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTask: Dispatch<SetStateAction<Partial<EditableTask>>>;
  task: EditableTask;
  setMode: Dispatch<SetStateAction<"add" | "edit">>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState<EditableTask>({});
  const [mode, setMode] = useState<"add" | "edit">("edit");

  const deadlineOptions = [
    {
      value: Date.now() + 4 * 60 * 60 * 1000,
      label: "4 hours",
    },
    {
      value: Date.now() + 8 * 60 * 60 * 1000,
      label: "8 hours",
    },
    {
      value: Date.now() + 12 * 60 * 60 * 1000,
      label: "12 hours",
    },
    {
      value: Date.now() + 24 * 60 * 60 * 1000,
      label: "1 day",
    },
    {
      value: Date.now() + 48 * 60 * 60 * 1000,
      label: "2 days",
    },
    {
      value: Date.now() + 72 * 60 * 60 * 1000,
      label: "3 days",
    },
  ];

  return (
    <EditorContext.Provider value={{ setOpen, setTask, task, setMode }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className=" bg-white p-4 text-blackAccent">
          {/* toolbar */}
          <div className=" flex items-center justify-between">
            <div className=" flex items-center gap-2">
              <SheetClose className="rounded-sm  focus:outline-none">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </SheetClose>
              <Maximize2 className=" w-4 h-4 rotate-90" />
            </div>

            <div className=" flex items-center gap-2 text-blackAccent">
              <button className=" bg-whiteAccentAccent px-2 py-1 rounded-md flex items-center gap-1">
                Share <Share2 className=" w-4 h-4" />
              </button>
              <button className=" bg-whiteAccentAccent px-2 py-1 rounded-md flex items-center gap-1">
                Favourite <Star className=" w-4 h-4" />
              </button>
            </div>
          </div>

          {/* header */}
          <input
            className=" w-full focus:outline-none h-14 text-3xl font-medium text-blackPrimary placeholder:text-blackAccent placeholder:opacity-70"
            placeholder="Title"
            value={task.title ?? ""}
            onChange={(e) => setTask((p) => ({ ...p, title: e.target.value }))}
            spellCheck={false}
            autoFocus={true}
          />

          <div className=" flex items-start pt-3 pb-8 ">
            <div className=" flex flex-col gap-6 w-fit  ">
              <div className=" flex items-center gap-2">
                <Loader className=" w-4 h-4" />
                Status
              </div>
              <div className=" flex items-center gap-2">
                <SquareActivityIcon className=" w-4 h-4" />
                Priority
              </div>

              <div className=" flex items-center gap-2">
                <Calendar className=" w-4 h-4" />
                Deadline{" "}
              </div>
              <div className=" flex items-center gap-2">
                <Pen className=" w-4 h-4" />
                Description
              </div>
            </div>

            <div className=" flex flex-col gap-4 w-full">
              {/* status */}

              <Select
                defaultValue={task?.status}
                onValueChange={(value) => {
                  console.log(value);
                  setTask((p) => ({ ...p, status: value as TaskStatus }));
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="w-full z-50 bg-white">
                  <SelectGroup>
                    <SelectItem
                      value={TaskStatus.ToDo}
                      className="hover:bg-whiteAccent"
                    >
                      To Do
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.InProgress}
                      className="hover:bg-whiteAccent"
                    >
                      In Progress
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.UnderReview}
                      className="hover:bg-whiteAccent"
                    >
                      Under Review
                    </SelectItem>
                    <SelectItem
                      value={TaskStatus.Completed}
                      className="hover:bg-whiteAccent"
                    >
                      Finished
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* priority */}
              <Select
                onValueChange={(value) => {
                  setTask((p) => ({ ...p, priority: value as TaskPriority }));
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent className="w-full z-50 bg-white">
                  <SelectGroup>
                    <SelectItem
                      value={TaskPriority.LOW}
                      className="hover:bg-whiteAccent"
                    >
                      Low
                    </SelectItem>
                    <SelectItem
                      value={TaskPriority.MEDIUM}
                      className="hover:bg-whiteAccent"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value={TaskPriority.URGENT}
                      className="hover:bg-whiteAccent"
                    >
                      Urgent
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* deadline */}

              <Select
                onValueChange={(value) => {
                  setTask((p) => ({ ...p, deadline: Number(value) }));
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select a deadline" />
                </SelectTrigger>
                <SelectContent className="w-full z-50 bg-white">
                  <SelectGroup>
                    {deadlineOptions.map((option) => (
                      <SelectItem
                        key={option.label}
                        value={String(option.value)}
                        className="hover:bg-whiteAccent"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <textarea
                className="resize-none focus:outline-none rounded-md p-2 border border-border w-10/11 h-36 self-center"
                spellCheck={false}
                onChange={(e) =>
                  setTask((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
          </div>
          {mode === "add" ? (
            <CreateNewTaskBtn
              data={task}
              onSuccess={() => {
                setOpen(false);
                setTask({});
              }}
            />
          ) : (
            <EditTaskBtn
              data={task}
              onSuccess={() => {
                setOpen(false);
                setTask({});
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </EditorContext.Provider>
  );
}

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("wrap");
  return context;
};
