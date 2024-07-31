import { useTask } from "@/hooks/use-tasks";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { TaskContainer } from "./task-container";
import { Task, TaskStatus } from "@/types";
import { TaskItem } from "./task-item";
import { SortBtnIcon } from "./svgs";
import { API, fetcher } from "@/fetcher";
import { Loader2 } from "lucide-react";

export function TaskBoard() {
  const { items, setItems, tasks, loading } = useTask();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findContainer(id: TaskStatus | string) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) =>
      items[key as TaskStatus].includes(id)
    );
  }

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id as string) as TaskStatus;
    const overContainer = findContainer(overId as string) as TaskStatus;

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id as string);
      const overIndex = overItems.indexOf(overId as string);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    const { id } = active;
    if (!over) return;
    const { id: overId } = over;

    const activeContainer = findContainer(id as string) as TaskStatus;
    const overContainer = findContainer(overId as string) as TaskStatus;
    if (overContainer) {
      console.log("here");
      const task = tasks.find((t) => t._id === id);
      if (task) {
        const editedTask: Task = { ...task, status: overContainer };
        fetcher(API.task.edit, {
          method: "PUT",
          body: JSON.stringify(editedTask),
        });
      }
    }

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id as string);
    const overIndex = items[overContainer].indexOf(overId as string);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  };
  return (
    <div className="bg-white p-4  rounded-md ">
      <div className=" grid text-blackAccent font-medium grid-cols-4 w-full gap-4 pb-2">
        <div className=" flex items-center justify-between">
          <p>To do</p>
          <SortBtnIcon />
        </div>
        <div className=" flex items-center justify-between">
          <p>In progress</p>
          <SortBtnIcon />
        </div>
        <div className=" flex items-center justify-between">
          <p>Under review</p>
          <SortBtnIcon />
        </div>
        <div className=" flex items-center justify-between">
          <p>Finished</p>
          <SortBtnIcon />
        </div>
      </div>
      {loading ? (
        <div className=" w-full h-[200px] flex items-center justify-center">
          <Loader2 className=" animate-spin w-10 h-10" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className=" w-full grid grid-cols-4 gap-4 min-h-64">
            <TaskContainer id={TaskStatus.ToDo} items={items.todo} />
            <TaskContainer
              id={TaskStatus.InProgress}
              items={items.inProgress}
            />
            <TaskContainer
              id={TaskStatus.UnderReview}
              items={items.underReview}
            />
            <TaskContainer id={TaskStatus.Completed} items={items.completed} />
            <DragOverlay>
              {activeId ? <TaskItem taskId={activeId} /> : null}
            </DragOverlay>
          </div>
        </DndContext>
      )}
    </div>
  );
}
