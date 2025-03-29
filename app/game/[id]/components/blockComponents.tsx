import {
  Block,
  CountBlock,
  MaxBlock,
  MinBlock,
  OutputBlock,
  SumBlock,
} from "@/lib/types/block";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { renderBlock } from "./game";

// 🔹 Droppable Zone
export function DroppableZone({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="min-h-[50px] border-2 border-dashed bg-white p-2"
    >
      {children || <p className="text-gray-400">Drop here</p>}
    </div>
  );
}

// 🔹 Draggable Blocks
export function BlockComponent({
  id,
  block,
  setContextMenu,
  fromLibrary,
  children,
}: {
  id: string;
  block: Block;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { block, fromLibrary },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!fromLibrary) {
          setContextMenu({ x: e.clientX, y: e.clientY, blockId: id });
        }
      }}
      className="min-h-[100px] min-w-[100px] cursor-pointer rounded bg-gray-300 p-4 shadow-md"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function InputBlockComponent() {
  return <p>Input Block</p>;
}

export function OutputBlockComponent({
  block,
  setContextMenu,
  fromLibrary,
}: {
  block: OutputBlock;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
}) {
  return (
    <>
      <p>Output Block</p>
      <DroppableZone id={block.id}>
        {block.block && renderBlock(block.block, setContextMenu, fromLibrary)}
      </DroppableZone>
    </>
  );
}

export function MinBlockComponent({
  block,
  setContextMenu,
  fromLibrary,
}: {
  block: MinBlock;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
}) {
  return (
    <>
      <p>Min Block</p>
      <DroppableZone id={block.id}>
        {block.listBlock &&
          renderBlock(block.listBlock, setContextMenu, fromLibrary)}
      </DroppableZone>
    </>
  );
}

export function MaxBlockComponent({
  block,
  setContextMenu,
  fromLibrary,
}: {
  block: MaxBlock;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
}) {
  return (
    <>
      <p>Max Block</p>
      <DroppableZone id={block.id}>
        {block.listBlock &&
          renderBlock(block.listBlock, setContextMenu, fromLibrary)}
      </DroppableZone>
    </>
  );
}

export function SumBlockComponent({
  block,
  setContextMenu,
  fromLibrary,
}: {
  block: SumBlock;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
}) {
  return (
    <>
      <p>Sum Block</p>
      <DroppableZone id={block.id}>
        {block.listBlock &&
          renderBlock(block.listBlock, setContextMenu, fromLibrary)}
      </DroppableZone>
    </>
  );
}

export function CountBlockComponent({
  block,
  setContextMenu,
  fromLibrary,
}: {
  block: CountBlock;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
}) {
  return (
    <>
      <p>Count Block</p>
      <DroppableZone id={block.id}>
        {block.listBlock &&
          renderBlock(block.listBlock, setContextMenu, fromLibrary)}
      </DroppableZone>
    </>
  );
}
