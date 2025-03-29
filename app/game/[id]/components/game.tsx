"use client";

import { BlockType } from "@/lib/types/block";
import { Challenge } from "@/lib/types/challenge";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { ReactElement, useState } from "react";
import { useImmer } from "use-immer";
import {
  BlockComponent,
  DroppableZone,
  InputBlockComponent,
  MinBlockComponent,
} from "./blockComponents";

export type BlockInfo = {
  id: string;
  blockType: BlockType;
  nestedBlocks: BlockInfo[];
};

export default function GameComponent({ challenge }: { challenge: Challenge }) {
  const [blocks, setBlocks] = useImmer<BlockInfo[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    blockId: string;
  } | null>(null);

  const availableBlocks: BlockInfo[] = [
    { id: crypto.randomUUID(), blockType: BlockType.Input, nestedBlocks: [] },
    { id: crypto.randomUUID(), blockType: BlockType.Min, nestedBlocks: [] },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return; // Ignore if not dropped anywhere

    const blockInfo = active.data.current?.blockInfo as BlockInfo;
    const fromLibrary = active.data.current?.fromLibrary as boolean;
    const newBlock: BlockInfo = fromLibrary
      ? {
          id: crypto.randomUUID(),
          blockType: blockInfo.blockType,
          nestedBlocks: [],
        }
      : cloneBlock(blockInfo);

    setBlocks((draft) => {
      if (over.id === "workspace") {
        draft.push(newBlock);
      } else {
        addBlockToParent(draft, over.id.toString(), newBlock);
      }
    });

    if (!fromLibrary) {
      setBlocks((draft) => removeBlock(draft, blockInfo.id));
    }
  };

  const handleDelete = () => {
    if (!contextMenu) return;
    setBlocks((draft) => removeBlock(draft, contextMenu.blockId));
    setContextMenu(null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className="relative flex gap-4 p-4"
        onClick={() => setContextMenu(null)}
      >
        {/* Available Blocks */}
        <div className="w-1/4 bg-gray-100 p-4">
          {availableBlocks.map((block) =>
            renderBlock(block, setContextMenu, true),
          )}
        </div>

        {/* Droppable Workspace */}
        <div className="flex-1 border p-4">
          <DroppableZone id="workspace">
            {blocks.map((block) => renderBlock(block, setContextMenu, false))}
          </DroppableZone>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="absolute rounded border bg-white p-2 text-sm shadow-md"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={handleDelete}
              className="w-full rounded px-4 py-1 text-red-600 hover:bg-red-100"
            >
              Delete Block
            </button>
          </div>
        )}
      </div>
    </DndContext>
  );
}

// 🔥 Mutable Helper to Find & Add Nested Block
// TODO: optimize this
export function addBlockToParent(
  blocks: BlockInfo[],
  targetId: string,
  newBlock: BlockInfo,
) {
  for (const block of blocks) {
    if (block.id === targetId) {
      block.nestedBlocks.push(newBlock);
      return true; // Stop recursion once inserted
    }
    if (addBlockToParent(block.nestedBlocks, targetId, newBlock)) return true;
  }
  return false;
}

// 🔥 Helper: Remove Block by ID (Recursive)
// TODO: optimize this
export function removeBlock(
  blocks: BlockInfo[],
  targetId: string,
): BlockInfo[] {
  return blocks
    .filter((block) => block.id !== targetId)
    .map((block) => ({
      ...block,
      nestedBlocks: removeBlock(block.nestedBlocks, targetId),
    }));
}

export function cloneBlock(originalBlock: BlockInfo): BlockInfo {
  let clonedBlock = structuredClone(originalBlock);
  const recur = (block: BlockInfo) => {
    block.id = crypto.randomUUID();
    for (const subBlock of block.nestedBlocks) {
      recur(subBlock);
    }

    return block;
  };
  return recur(clonedBlock);
}

// 🔹 Render Blocks
export function renderBlock(
  block: BlockInfo,
  setContextMenu: any,
  fromLibrary: boolean = false,
): ReactElement {
  let child;
  switch (block.blockType) {
    case BlockType.Input:
      child = <InputBlockComponent />;
      break;
    case BlockType.Min:
      child = (
        <MinBlockComponent
          id={block.id}
          blockInfo={block}
          setContextMenu={setContextMenu}
          fromLibrary={fromLibrary}
        />
      );
      break;
    default:
      return <div key={block.id}>Unsupported Block</div>;
  }
  return (
    <BlockComponent
      key={block.id}
      id={block.id}
      blockInfo={block}
      setContextMenu={setContextMenu}
      fromLibrary={fromLibrary}
    >
      {child}
    </BlockComponent>
  );
}
