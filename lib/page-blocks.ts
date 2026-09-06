import type { PageBlock, PageBlockType } from "@/types/company";

// Shared by both the public careers page and the editor/preview.

export function findBlock<T extends PageBlockType>(
  blocks: PageBlock[],
  type: T
): Extract<PageBlock, { type: T }> | undefined {
  return blocks.find(
    (block): block is Extract<PageBlock, { type: T }> => block.type === type
  );
}

export function isBlockVisible(block: PageBlock | undefined): boolean {
  return block?.visible === true;
}
