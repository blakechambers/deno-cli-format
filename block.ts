import { wrapText } from "./util.ts";
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
  public width?: number;
  public height?: number;
  public paddingLeft: number;
  public paddingRight: number;
  public paddingTop: number;
  public paddingBottom: number;
  public textAlign: TextAlignStrings;

  constructor(content: string, options: BlockOptions = {}) {
    this.content = content;
    this.width = options.width;
    this.height = options.height;
    this.paddingLeft = options.paddingLeft || 0;
    this.paddingRight = options.paddingRight || 0;
    this.paddingTop = options.paddingTop || 0;
    this.paddingBottom = options.paddingBottom || 0;
    this.textAlign = options.textAlign || "left";
  }

  render(width: number, height?: number): Array<string> {
    width = this.width || width;

    const eligibleContentWidth = width - this.paddingLeft - this.paddingRight;

    // subtract padding from width to determine the max width of the content
    const blockWidth = eligibleContentWidth;

    const wrappedContentLines: string[] = this.renderBlockContent(
      blockWidth,
      undefined,
    );

    const paddedContentLines = this.padLines(wrappedContentLines);

    if (this.height && paddedContentLines.length > this.height) {
      throw new Error("Content height is greater than block height");
    }

    return paddedContentLines;
  }

  padLines(lines: string[]): string[] {
    // get line length from first line
    const lineLength = lines[0].length;

    const verticallyPaddedContentLines = [
      ...Array(this.paddingTop).fill("".padEnd(lineLength)),
      ...lines,
      ...Array(this.paddingBottom).fill("".padEnd(lineLength)),
    ];

    const leftPadding = "".padStart(this.paddingLeft);
    const rightPadding = "".padStart(this.paddingRight);

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
