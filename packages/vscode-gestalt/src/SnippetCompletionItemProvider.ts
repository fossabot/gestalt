import log from "./log";
import track from "./track";

import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  CompletionList,
  Position,
  SnippetString,
  CompletionContext,
  CompletionTriggerKind,
  CancellationToken,
  TextDocument,
  Range,
} from "vscode";
import snippets from "./snippets.json";
import { MarkdownString } from "vscode";
import { SnippetParser } from "./snippetParser";

class SnippetCompletionItem implements CompletionItem {
  kind?: CompletionItemKind;
  label: string;
  detail: string;
  insertText?: SnippetString;
  range: Range;
  documentation?: MarkdownString;

  constructor({
    label,
    prefix,
    text,
    range,
  }: {
    label: string;
    prefix: string;
    text: SnippetString;
    range: Range;
  }) {
    this.label = prefix;
    this.insertText = text;
    this.range = range;
    this.detail = label;
    this.kind = CompletionItemKind.Snippet;
  }

  resolve(): this {
    // this.documentation = new MarkdownString().appendCodeblock(
    //   "",
    //   this.insertText?.value
    // );
    const text = new SnippetParser().text(this.insertText?.value ?? "");
    this.documentation = new MarkdownString().appendCodeblock(text);

    return this;
  }
}

class SnippetCompletionItemProvider
  implements CompletionItemProvider<CompletionItem> {
  async resolveCompletionItem(
    item: SnippetCompletionItem
  ): Promise<SnippetCompletionItem | undefined> {
    return item instanceof SnippetCompletionItem ? item.resolve() : item;
  }

  public provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ): CompletionList<CompletionItem> | undefined {
    log.append("provideCompletionItems");
    // log.append(JSON.stringify(snippets, null, 2));

    // const textBeforeCursor = document
    //   .getText(new Range(position.with(undefined, 0), position))
    //   .split(/(\s+)/)[0];

    const textBeforeCursor = document
      .getText(document.lineAt(position.line).range)
      .trim();

    if (!textBeforeCursor) {
      return undefined;
    }

    log.append(`textBeforeCursor: ${textBeforeCursor}`);

    // console.log(position,snippets);

    return new CompletionList(
      Object.entries(snippets)
        .filter(([_, { prefix }]) => {
          return prefix
            .toLocaleLowerCase()
            .startsWith(textBeforeCursor.toLocaleLowerCase());
        })
        .map(([label, { prefix, body }]) => {
          const text = body.join("\n");
          const completionItem = new SnippetCompletionItem({
            label,
            prefix,
            range: new Range(
              position.translate(0, -textBeforeCursor.length),
              position
            ),
            text: new SnippetString(text),
          });

          log.append(`label: ${label}`);

          return completionItem;
        })
    );

    // return undefined;

    // const input = 'Good ${1|morning,afternoon,evening|}. It is ${1}, right?';

    // const snippetCompletion = new vscode.CompletionItem('Good part of the day');
    // snippetCompletion.insertText = new vscode.SnippetString(input);
    // snippetCompletion.documentation = new vscode.MarkdownString(
    //   'Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.'
    // );
    // snippetCompletion.kind = vscode.CompletionItemKind.Snippet;
    // snippetCompletion.command = {
    //   command: 'gestalt.track.snippet',
    //   title: 'Track snippet insertion',
    //   arguments: [{ length: input.length }],
    // };

    // const storeInstance = store.get();

    // log.append("// provideCompletionItems activated");

    // if (!storeInstance) {
    //   return undefined;
    // }

    // const linePrefix = document
    //   .lineAt(position)
    //   .text.substr(0, position.character);

    // const matched = linePrefix.match(/(['"][\w-_]+)$/);
    // if (!matched) {
    //   return undefined;
    // }

    // const language = ownedByFilter(document.languageId, linePrefix);

    // if (!language) {
    //   return undefined;
    // }

    // const searchIndex = storeInstance.nimbusProjects;

    // const search = matched[0].replace(/['"]/g, "");
    // const fuse = new Fuse(searchIndex, {
    //   keys: ["projectName"],
    //   threshold: 0.2,
    // });
    // const results = fuse.search(search);

    // if (!results) {
    //   return undefined;
    // }

    // track.event({
    //   category: "Event",
    //   action: "Count",
    //   label: "AutocompletionOwnedBy",
    //   value: String(results.length),
    // });

    // return new CompletionList(
    //   results.map(({ item }) => {
    //     const completionItem = new SnippetCompletionItem(
    //       item.projectName,
    //       CompletionItemKind.Text,
    //       item
    //     );

    //     return completionItem;
    //   })
    // );
  }
}

export default SnippetCompletionItemProvider;
