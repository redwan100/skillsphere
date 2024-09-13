"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Chapter } from "@prisma/client";
import { Grip, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
type ChapterListProps = {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
};
const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDrag = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItems);

    const startIndex = Math.min(result.source.index, result.destination.index);

    const endIndex = Math.max(result.source.index, result.destination.index);

    const updateChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);

    const bulkUpdateData = updateChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDrag}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chapters?.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "mb-4 flex items-center gap-x-2 border border-slate-200 bg-slate-200 text-sm text-slate-700 ring-muted",
                        chapter.isPublished &&
                          "border-s-sky-200 bg-sky-100 text-sky-700",
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          "rounded-l-md border-r-slate-200 px-2 py-3 transition hover:bg-slate-300",
                          chapter.isPublished &&
                            "border-r-sky-200 hover:bg-sky-200",
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="size-5" />
                      </div>
                      {chapter?.title}
                      <div className="ml-auto flex items-center gap-x-2">
                        {chapter?.isFree && <Badge>Free</Badge>}

                        <Badge
                          className={cn(
                            "bg-slate-500",
                            chapter.isPublished && "bg-sky-700",
                          )}
                        >
                          {chapter?.isPublished ? "Published" : "Draft"}
                        </Badge>

                        <Pencil
                          onClick={() => onEdit(chapter.id)}
                          className="size-4 cursor-pointer transition hover:opacity-75"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ChapterList;
