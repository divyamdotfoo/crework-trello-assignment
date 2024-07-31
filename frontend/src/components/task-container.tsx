import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableTaskItem } from "./task-item";
import { OpenNewTaskSheet } from "./btns";
import { TaskStatus } from "@/types";
export function TaskContainer({
  id,
  items,
}: {
  id: TaskStatus;
  items: string[];
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="flex flex-col gap-3">
        {items.map((z) => (
          <SortableTaskItem key={z} taskId={z} />
        ))}
        <OpenNewTaskSheet variant={id} />
      </div>
    </SortableContext>
  );
}
