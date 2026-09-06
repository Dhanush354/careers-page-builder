"use client";

import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { AddSectionDialog } from "@/components/editor/add-section-dialog";
import { SectionRow } from "@/components/editor/section-row";
import { createDefaultBlock } from "@/lib/editor/defaults";
import { cn } from "@/lib/utils";
import { OPTIONAL_BLOCK_TYPES } from "@/types/company";
import type { PageBlock, PageBlockType } from "@/types/company";

const NOT_REMOVABLE: ReadonlySet<PageBlockType> = new Set(["hero", "openRoles"]);
const VISIBILITY_LOCKED: ReadonlySet<PageBlockType> = new Set(["openRoles"]);

function reorder(list: PageBlock[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function SectionManager({
  blocks,
  companyName,
  onChange,
}: {
  blocks: PageBlock[];
  companyName: string;
  onChange: (blocks: PageBlock[]) => void;
}) {
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    onChange(reorder(blocks, result.source.index, result.destination.index));
  }

  function handleBlockChange(updated: PageBlock) {
    onChange(blocks.map((block) => (block.id === updated.id ? updated : block)));
  }

  function handleRemove(id: string) {
    onChange(blocks.filter((block) => block.id !== id));
  }

  function handleAdd(type: PageBlockType) {
    onChange([...blocks, createDefaultBlock(type, companyName)]);
  }

  const availableTypes = OPTIONAL_BLOCK_TYPES.filter(
    (type) => !blocks.some((block) => block.type === type)
  );

  return (
    <div className="flex flex-col gap-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="page-blocks">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="flex flex-col gap-2"
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(draggableProvided, snapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      className={cn(
                        "rounded-lg transition-shadow",
                        snapshot.isDragging && "shadow-md"
                      )}
                    >
                      <SectionRow
                        block={block}
                        dragHandleProps={draggableProvided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        removable={!NOT_REMOVABLE.has(block.type)}
                        visibilityLocked={VISIBILITY_LOCKED.has(block.type)}
                        onChange={handleBlockChange}
                        onRemove={() => handleRemove(block.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <AddSectionDialog availableTypes={availableTypes} onAdd={handleAdd} />
    </div>
  );
}
