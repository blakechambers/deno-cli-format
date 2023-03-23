function wrapText(text: string, width: number): string {
  const words = text.split(/\s+/);
  let wrappedText = "";
  let currentLineWidth = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordWidth = word.length + 1; // include space character

    if (currentLineWidth + wordWidth > width) {
      wrappedText = wrappedText.trim();

      wrappedText += "\n";
      currentLineWidth = 0;
    }

    wrappedText += word + " ";
    currentLineWidth += wordWidth;
  }

  return wrappedText.trim();
}

export { wrapText };
