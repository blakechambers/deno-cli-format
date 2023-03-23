import { Block, BlockOptions } from "./block.ts";

interface MultiColumnLayoutOptions extends BlockOptions {
  blocks: Block[];
  marginX?: number;
}

class MultiColumnLayoutBlock extends Block {
  public blocks: Block[];
  public marginX: number;

  constructor(options: MultiColumnLayoutOptions) {
    super("", options);
    this.blocks = options.blocks;
    this.marginX = options.marginX || 0;
  }

  renderBlockContent(width: number, height?: number): Array<string> {
    // iterate through blocks to see which are fixed or fluid width.  if all blocks are fixed width, determine if they fit in the width of the layout block, or too throw an error.
    const totalWidth = width;
    let availableWidth = totalWidth;

    // throw an error if more than 1 block is fluid width
    const fluidWidthBlocks = this.blocks.filter((block) => !block.width);
    if (fluidWidthBlocks.length > 1) {
      throw new Error("Only 1 block can be fluid width");
    }

    // subtract total width of fixed width blocks from available width
    const fixedWidthBlocks = this.blocks.filter((block) => block.width);
    fixedWidthBlocks.forEach((block) => {
      if (block.width) {
        availableWidth -= block.width;
      }
    });

    // subtract total width of margins from available width
    availableWidth -= this.marginX * (this.blocks.length - 1);

    // if there is a fluid width block, set the width of the block to the remaining width
    if (fluidWidthBlocks.length === 1) {
      const fluidWidthBlock = fluidWidthBlocks[0];
      fluidWidthBlock.width = availableWidth;
      availableWidth = 0;
    }

    // render each block, taking account of the fluid vs fixed width blocks
    const renderedBlocks = this.blocks.map((block) => {
      return block.render(block.width || availableWidth);
    });

    // determine the longest block
    const longestBlock = renderedBlocks.reduce(
      (acc, block) => {
        if (block.length > acc.length) {
          return block;
        }
        return acc;
      },
      [] as string[],
    );

    // pad each block to match the height of the longest block
    const paddedBlocks: string[][] = renderedBlocks.map((block) => {
      const padding = longestBlock.length - block.length;
      return [...block, ...Array(padding).fill("".padEnd(block[0].length))];
    });

    // combine blocks into a single block
    let combinedLines: string[] = [];
    for (let i = 0; i < longestBlock.length; i++) {
      const lineFragments = paddedBlocks.map((block) => block[i]);

      combinedLines.push(lineFragments.join("".padEnd(this.marginX)));
    }

    return combinedLines;
  }
}

export { MultiColumnLayoutBlock };
export type { MultiColumnLayoutOptions };
