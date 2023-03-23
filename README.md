# deno-cli-format

This library provides a simple way to create and render text blocks with
padding, alignment, and multi-column layout support for console applications in
Deno.

## Features

- Create text blocks with fixed or fluid width
- Apply padding and text alignment within blocks
- Render multi-column layouts with fixed or fluid columns
- Strongly typed
- Support for console applications in Deno

## Usage

```typescript
import { Block, MultiColumnLayoutBlock } from "./mod.ts";

// Create a new Block instance
const myBlock = new Block(content, {
  width: 40,
  paddingLeft: 2,
  paddingRight: 2,
  paddingTop: 1,
  paddingBottom: 1,
  textAlign: "left",
});

// Create a MultiColumnLayoutBlock instance
const multiColumnLayout = new MultiColumnLayoutBlock({
  blocks: [block1, block2],
  marginX: 4,
  paddingTop: 1,
  paddingBottom: 1,
  paddingLeft: 2,
  paddingRight: 2,
});

// Render a block or multi-column layout with a specified width
const outputLines = myBlock.render(width);
```
