import { useDraggable, useDroppable } from "@dnd-kit/core";
import { BlockInfo, renderBlock } from "./game";

// 🔹 Draggable Blocks
export function BlockComponent({
  id,
  blockInfo,
  setContextMenu,
  fromLibrary,
  children,
}: {
  id: string;
  blockInfo: BlockInfo;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { blockInfo, fromLibrary },
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
  return <p> Input Block</p>;
}

export function MinBlockComponent({
  id,
  blockInfo,
  setContextMenu,
  fromLibrary,
}: {
  id: string;
  blockInfo: BlockInfo;
  setContextMenu: (
    context: { x: number; y: number; blockId: string } | null,
  ) => void;
  fromLibrary: boolean;
}) {
  return (
    <>
      <p>Min Block</p>
      <DroppableZone id={id}>
        {blockInfo.nestedBlocks.map((subBlock) =>
          renderBlock(subBlock, setContextMenu, fromLibrary),
        )}
      </DroppableZone>
    </>
  );
}

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
