import * as vscode from "vscode";
import snippets from "./snippets.json";

interface CustomInlineCompletionItem extends vscode.InlineCompletionItem {
  trackingId: string;
}

function isPatternInWord(
  patternLow: string,
  patternPos: number,
  patternLen: number,
  wordLow: string,
  wordPos: number,
  wordLen: number
): boolean {
  while (patternPos < patternLen && wordPos < wordLen) {
    if (patternLow[patternPos] === wordLow[wordPos]) {
      patternPos += 1;
    }
    wordPos += 1;
  }
  return patternPos === patternLen; // pattern must be exhausted
}

const provider: vscode.InlineCompletionItemProvider<CustomInlineCompletionItem> = {
  provideInlineCompletionItems: async (document, position, context, token) => {
    // <Bo
    const textBeforeCursor = document
      .getText(new vscode.Range(position.with(undefined, 0), position))
      .split(/(\s+)/)[0];

    if (!textBeforeCursor) {
      return { items: [] };
    }

    const items = new Array<CustomInlineCompletionItem>();

    Object.entries(snippets).map(([label, { prefix, body }]) => {
      // <Box
      if (prefix.startsWith(textBeforeCursor)) {
        items.push({
          text: body.join("\n"),
          range: new vscode.Range(position.translate(0, body.length), position),
          trackingId: `snippet-${Math.floor(Math.random() * 10000)}`,
        });
      }

      // const completionItem = new SnippetCompletionItem(
      //   label,
      //   prefix,
      //   new SnippetString(body.join("\n"))
      // );
      // return completionItem;
    });

    return { items };
  },
};

export default provider;
