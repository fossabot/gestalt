// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  commands,
  languages,
  DocumentSelector,
  Disposable,
  ExtensionContext,
} from "vscode";
import log from "./log";
import SnippetCompletionItemProvider from "./SnippetCompletionItemProvider";
import track from "./track";

const documentSelector: DocumentSelector = [
  "javascript",
  "javascriptreact",
  "jsx",
  "plaintext",
  "typescript",
  "typescriptreact",
];

function addProviders(): Disposable {
  const subscriptions: Disposable[] = [
    languages.registerCompletionItemProvider(
      documentSelector,
      new SnippetCompletionItemProvider()
    ),
  ];
  return Disposable.from(...subscriptions);
}

export function activate(context: ExtensionContext) {
  log.append('Extension "vscode-gestalt" is now active!');

  track.event({
    category: "Event",
    action: "Activate",
    label: "Extension",
  });

  addProviders();

  // // The command has been defined in the package.json file
  // // Now provide the implementation of the command with registerCommand
  // // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand(
  //   "vscode-gestalt.helloWorld",
  //   () => {
  //     // The code you place here will be executed every time your command is executed
  //     // Display a message box to the user
  //     vscode.window.showInformationMessage("Hello World from Gestalt!");
  //   }
  // );

  // context.subscriptions.push(disposable);

  // vscode.languages.registerInlineCompletionItemProvider(
  //   { pattern: '**' },
  //   provider
  // );

  // Be aware that the API around `getInlineCompletionItemController` will not be finalized as is!
  // vscode.window
  //   .getInlineCompletionItemController(provider)
  //   .onDidShowCompletionItem((e) => {
  //     const id = e.completionItem.trackingId;
  //   });
}

// this method is called when your extension is deactivated
export function deactivate() {}
