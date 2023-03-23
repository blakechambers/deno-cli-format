import { Block } from "./block.ts";
import { MultiColumnLayoutBlock } from "./multi_column_layout_block.ts";

function outputBlock(block: Block, width: number, height?: number) {
  const iter = block.render(width, height)[Symbol.iterator]();

  for (const line of iter) {
    console.log(line);
  }
}

if (import.meta.main) {
  const LargeTextBlock =
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut velit tortor. Aliquam erat volutpat. Cras egestas augue vel convallis pretium. Cras fringilla, elit ut facilisis semper, tortor odio aliquet ex, in tempor ligula tellus ut neque. Curabitur nec orci eget ex condimentum efficitur. Mauris vehicula tristique purus, vel rutrum risus gravida vitae. Aenean metus enim, sodales aliquam felis at, porttitor consectetur diam. Curabitur eu maximus metus, quis sagittis justo. Quisque accumsan, turpis sit amet interdum sollicitudin, nisi lorem accumsan arcu, pharetra vehicula odio ex quis libero. Nam porttitor neque leo, quis commodo dui aliquam in.

Aenean tincidunt purus in justo dapibus, sit amet luctus enim pellentesque. Maecenas placerat nisl orci, in mollis nisl blandit a. Integer consequat interdum posuere. Phasellus sapien leo, lacinia dictum blandit id, fringilla nec enim. Etiam placerat dictum maximus. Sed tristique placerat est, a convallis ex posuere eu. Nam mi magna, mollis et tellus nec, consectetur egestas diam. Donec at tortor lectus. Vivamus vulputate pulvinar lacinia. Nullam cursus commodo tortor ut porttitor. Sed justo justo, vehicula ac quam in, vestibulum ornare augue. Morbi malesuada mauris libero, a scelerisque risus faucibus sodales. Morbi sed euismod nisl. Donec viverra leo ligula, interdum pharetra risus condimentum sit amet.`;

  const sentence =
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non vehicula mi, a volutpat felis. Nunc vel venenatis magna, ut fermentum ipsum. Ut varius enim.`;

  const { columns: width, rows: height } = Deno.consoleSize();

  const paddingX = 6;
  const paddingY = 3;

  const fixedColumnWidth = 40;

  const fullBlock = new Block(LargeTextBlock, {
    // paddingBottom: paddingY,
    paddingTop: paddingY,
    paddingLeft: paddingX,
    paddingRight: paddingX,
  });

  outputBlock(fullBlock, width);

  // two column layout, fluid right column
  const rightColumn = new Block(LargeTextBlock);
  const leftColumn = new Block(sentence, {
    width: fixedColumnWidth,
  });
  const twoColumnLayout = new MultiColumnLayoutBlock({
    blocks: [leftColumn, rightColumn],
    marginX: paddingX,
    // paddingBottom: paddingY,
    paddingTop: paddingY,
    paddingLeft: paddingX,
    paddingRight: paddingX,
  });

  outputBlock(twoColumnLayout, width);

  // several column layout, text justifications
  const blocks = [
    new Block(sentence, {
      width: fixedColumnWidth,
    }),
    new Block(sentence, {
      width: fixedColumnWidth,
      textAlign: "right",
    }),
    new Block(sentence, {
      width: fixedColumnWidth,
      textAlign: "left",
    }),
  ];

  const severalColumnLayout = new MultiColumnLayoutBlock({
    blocks,
    marginX: paddingX,
    paddingBottom: paddingY,
    paddingTop: paddingY,
    paddingLeft: paddingX,
    paddingRight: paddingX,
  });

  outputBlock(severalColumnLayout, width);
}
