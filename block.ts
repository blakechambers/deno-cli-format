import { wrapText } from "./util.ts";

function extractPaddingOptions(options: BlockOptions): BlockPaddingOptions {
  const padding: BlockPaddingOptions = {};

  if (options.paddingLeft !== undefined) {
    padding.left = options.paddingLeft;
  }

  if (options.paddingRight !== undefined) {
    padding.right = options.paddingRight;
  }

  if (options.paddingTop !== undefined) {
    padding.top = options.paddingTop;
  }

  if (options.paddingBottom !== undefined) {
    padding.bottom = options.paddingBottom;
  }

  return padding;
}

interface BlockPaddingOptions {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

interface BlockSizeOptions {
  width?: number;
  height?: number;
}

class BlockPadding {
  public left: number;
  public right: number;
  public top: number;
  public bottom: number;

  constructor(options: BlockPaddingOptions = {}) {
    this.left = options.left || 0;
    this.right = options.right || 0;
    this.top = options.top || 0;
    this.bottom = options.bottom || 0;
  }
}

class BlockSize {
  public width: number;
  public height: number;

  constructor(options: BlockSizeOptions = {}) {
    this.width = options.width || 0;
    this.height = options.height || 0;
  }
}

interface BlockOptions {
  width?: number;
  height?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  textAlign?: TextAlignStrings;
}

enum TextAlign {
  left = "left",
  right = "right",
  // center = "center",
}

// TextAlign union
type TextAlignStrings = keyof typeof TextAlign;

class Block {
  public content: string;
  public padding: BlockPadding;
  public size : BlockSize;
  public textAlign: TextAlignStrings;

  constructor(content: string, options: BlockOptions = {}) {
    this.content = content;
    this.padding = new BlockPadding(extractPaddingOptions(options));
    this.size = new BlockSize(options);
    this.textAlign = options.textAlign || TextAlign.left;
  }

  render(width: number, height?: number, truncate = true): Array<string> {
    width = this.size.width || width;

    const eligibleContentWidth = width - this.padding.left - this.padding.right;

    // subtract padding from width to determine the max width of the content
    const blockWidth = eligibleContentWidth;

    const wrappedContentLines: string[] = this.renderBlockContent(
      blockWidth,
      height,
    );

    let paddedContentLines = this.padLines(wrappedContentLines);

    if (height && paddedContentLines.length > height) {
      if (truncate) {
        paddedContentLines = paddedContentLines.slice(0, height);
      } else {
        throw new Error("Content height is greater than block height");
      }
    }

    return paddedContentLines;
  }

  padLines(lines: string[]): string[] {
    const lineLength = lines.reduce(
      (max, line) => Math.max(max, line.length),
      0,
    );

    const verticallyPaddedContentLines = [
      ...Array(this.padding.top).fill("".padEnd(lineLength)),
      ...lines,
      ...Array(this.padding.bottom).fill("".padEnd(lineLength)),
    ];

    const leftPadding = "".padStart(this.padding.left);
    const rightPadding = "".padStart(this.padding.right);

    const horizontallyPaddedContentLines: string[] =
      verticallyPaddedContentLines.map(
        (line) => {
          return leftPadding + line + rightPadding;
        },
      );

    return horizontallyPaddedContentLines;
  }

  renderBlockContent(
    width: number,
    height?: number,
  ): Array<string> {
    const wrappedLines = this.content.trim().split("\n")
      .reduce(
        (acc, line) => {
          if (line.length > width) {
            const wrappedLines = wrapText(line, width).split("\n");
            if (wrappedLines) {
              acc.push(...wrappedLines);
            }
          } else {
            acc.push(line);
          }
          return acc;
        },
        [] as string[],
      );

    const justifiedLines: string[] = wrappedLines.map(
      (line) => {
        // pad line, and add in padding from block
        if (this.textAlign === "left") {
          line = line.padEnd(width);
        } else if (this.textAlign === "right") {
          line = line.padStart(width);
        }

        return line;
      },
    );

    return justifiedLines;
  }
}

export { Block };
export type { BlockOptions };
