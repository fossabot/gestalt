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
} from "vscode";
import snippets from "./snippets.json";
import { MarkdownString } from "vscode";
import { SnippetParser } from "./snippetParser";

class SnippetCompletionItem implements CompletionItem {
  kind?: CompletionItemKind;
  label: string;
  detail: string;
  insertText?: SnippetString;
  documentation?: MarkdownString;

  constructor(label: string, prefix: string, text: SnippetString) {
    this.label = prefix;
    this.insertText = text;
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
    this.detail = this.detail;

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

  public async provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionList<CompletionItem> | undefined> {
    log.append("provideCompletionItems");
    log.append(JSON.stringify(snippets, null, 2));

    if (
      context.triggerKind === CompletionTriggerKind.TriggerCharacter &&
      context.triggerCharacter === " "
    ) {
      // no snippets when suggestions have been triggered by space
      return undefined;
    }

    return new CompletionList(
      Object.entries(snippets).map(([label, { prefix, body }]) => {
        console.log(document, token, position, snippets);

        // const prefixPos = position.column - (1 + start);

        const completionItem = new SnippetCompletionItem(
          label,
          prefix,
          new SnippetString(body.join("\n"))
        );

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
