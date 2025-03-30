"use client";

import {
  Block,
  BlockType,
  CountBlock,
  InputBlock,
  MaxBlock,
  MinBlock,
  OutputBlock,
  SumBlock,
} from "@/lib/types/block";
import { ChallengeDetail } from "@/lib/types/challenge";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { ReactElement, useState } from "react";
import {
  BlockComponent,
  CountBlockComponent,
  DroppableZone,
  InputBlockComponent,
  MaxBlockComponent,
  MinBlockComponent,
  OutputBlockComponent,
  SumBlockComponent,
} from "./blockComponents";

export default function GameComponent({
  challenge,
}: {
  challenge: ChallengeDetail;
}) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [submissionResult, setSubmissionResult] = useState<number | null>(null); // float up to 100

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    blockId: string;
  } | null>(null);

  const libraryBlocks: Block[] = [
    new InputBlock(),
    new OutputBlock(null),
    new MinBlock(null),
    new MaxBlock(null),
    new SumBlock(null),
    new CountBlock(null),
  ];

  const handleSubmit = async () => {
    let body = "";
    for (const block of blocks) {
      if (block instanceof OutputBlock) {
        body = Block.stringify(block);
        // console.log(body);
        break;
      }
    }
    if (body == "") {
      alert("Output Block Not Found");
      return;
    }

    try {
      setSubmissionResult(null);
      const response = await fetch(`/api/challenges/${challenge.id}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      if (!response.ok) {
        alert("Error: not ok");
        return;
      }
      const data = await response.json();
      // console.log("DATA: ", data);
      setSubmissionResult(data.result || 0);
    } catch (error) {
      alert("Error2: " + error);
    }
  };

  const recursiveCreate = (
    block: Block,
    innerBlock: Block,
    innerFromLibrary: boolean,
    outerId: string,
  ): { block: Block; ok: boolean } => {
    if (block.id == outerId) {
      if (block instanceof InputBlock) {
        return { block, ok: false };
      } else if (block instanceof OutputBlock) {
        if (block.block) {
          return { block, ok: false };
        }
        block.block = innerBlock;
        return { block, ok: true };
      } else if (
        block instanceof MinBlock ||
        block instanceof MaxBlock ||
        block instanceof SumBlock ||
        block instanceof CountBlock
      ) {
        if (block.listBlock) {
          return { block, ok: false };
        }
        block.listBlock = innerBlock;
        return { block, ok: true };
      } else {
        return { block, ok: false };
      }
    }

    if (block instanceof InputBlock) {
      return { block, ok: false };
    } else if (block instanceof OutputBlock) {
      if (block.block) {
        const { block: resultBlock, ok } = recursiveCreate(
          block.block,
          innerBlock,
          innerFromLibrary,
          outerId,
        );
        block.block = resultBlock;
        return { block, ok };
      }
      return { block, ok: false };
    } else if (
      block instanceof MinBlock ||
      block instanceof MaxBlock ||
      block instanceof SumBlock ||
      block instanceof CountBlock
    ) {
      if (block.listBlock) {
        const { block: resultBlock, ok } = recursiveCreate(
          block.listBlock,
          innerBlock,
          innerFromLibrary,
          outerId,
        );
        block.listBlock = resultBlock;
        return { block, ok };
      }
      return { block, ok: false };
    } else {
      return { block, ok: false };
    }
  };

  const recursiveDelete = (block: Block, targetId: string): Block | null => {
    if (block.id == targetId) {
      return null;
    }

    if (block instanceof InputBlock) {
      return block;
    } else if (block instanceof OutputBlock) {
      if (block.block) {
        block.block = recursiveDelete(block.block, targetId);
      }
      return block;
    } else if (
      block instanceof MinBlock ||
      block instanceof MaxBlock ||
      block instanceof SumBlock ||
      block instanceof CountBlock
    ) {
      if (block.listBlock) {
        block.listBlock = recursiveDelete(block.listBlock, targetId);
      }
      return block;
    } else {
      return null;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return; // Ignore if not dropped anywhere

    // console.log("active: ", active);
    // console.log("over: ", over);

    const innerBlock = active.data.current?.block as Block;
    const innerFromLibrary = active.data.current?.fromLibrary as boolean;
    const outerId = over.id.toString();

    if (outerId === "workspace") {
      setBlocks((prev) => {
        let result: Block[] = [];
        const clonedInnerBlock = innerBlock.clone();

        if (!innerFromLibrary) {
          for (const block of prev) {
            const newBlock = recursiveDelete(block, innerBlock.id);
            if (newBlock) result.push(newBlock);
          }
        } else {
          result = prev;
        }
        result = [...result, clonedInnerBlock];
        return result;
      });
      return;
    }

    // console.log("normal create or move");

    setBlocks((prev) => {
      const result: Block[] = [];
      let ok = false;
      for (const block of prev) {
        const createResult = recursiveCreate(
          block,
          innerBlock.clone(),
          innerFromLibrary,
          outerId,
        );
        ok = createResult.ok || ok;
        result.push(createResult.block);
      }

      const result2: Block[] = [];
      if (ok && !innerFromLibrary) {
        for (const block of result) {
          const newBlock = recursiveDelete(block, innerBlock.id);
          if (newBlock) result2.push(newBlock);
        }
        return result2;
      }

      return result;
    });
  };

  const handleDelete = () => {
    if (!contextMenu) return;

    setBlocks((prev) => {
      const result: Block[] = [];
      for (const block of prev) {
        const newBlock = recursiveDelete(block, contextMenu.blockId);
        if (newBlock) result.push(newBlock);
      }
      return result;
    });
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
          {libraryBlocks.map((block) =>
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

        {/* Submitting Menu */}
        <div className="w-1/4 bg-gray-100 p-4">
          <button onClick={() => handleSubmit()} className="btn btn-neutral">
            Submit Code
          </button>
          {submissionResult != null && <p>Result: {submissionResult}%</p>}
        </div>
      </div>
    </DndContext>
  );
}

// 🔹 Render Blocks
export function renderBlock(
  block: Block,
  setContextMenu: any,
  fromLibrary: boolean = false,
): ReactElement {
  let child;
  switch (block.name) {
    case BlockType.Input:
      child = <InputBlockComponent />;
      break;
    case BlockType.Output:
      child = (
        <OutputBlockComponent
          block={block as OutputBlock}
          setContextMenu={setContextMenu}
          fromLibrary={fromLibrary}
        ></OutputBlockComponent>
      );
      break;
    case BlockType.Min:
      child = (
        <MinBlockComponent
          block={block as MinBlock}
          setContextMenu={setContextMenu}
          fromLibrary={fromLibrary}
        ></MinBlockComponent>
      );
      break;
    case BlockType.Max:
      child = (
        <MaxBlockComponent
          block={block as MaxBlock}
          setContextMenu={setContextMenu}
          fromLibrary={fromLibrary}
        ></MaxBlockComponent>
      );
      break;
    case BlockType.Sum:
      child = (
        <SumBlockComponent
          block={block as MaxBlock}
          setContextMenu={setContextMenu}
          fromLibrary={fromLibrary}
        ></SumBlockComponent>
      );
      break;
    case BlockType.Count:
      child = (
        <CountBlockComponent
          block={block as MaxBlock}
          setContextMenu={setContextMenu}
          fromLibrary={fromLibrary}
        ></CountBlockComponent>
      );
      break;
    default:
      return <div key={block.id}>Unsupported Block</div>;
  }
  return (
    <BlockComponent
      key={block.id}
      id={block.id}
      block={block}
      setContextMenu={setContextMenu}
      fromLibrary={fromLibrary}
    >
      {child}
    </BlockComponent>
  );
}
