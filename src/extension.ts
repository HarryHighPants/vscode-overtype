import * as vscode from "vscode";

import { overtypeBeforePaste, overtypeBeforeType } from "./behavior";
import { configuration, reloadConfiguration } from "./configuration";
import { getMode, resetModes, toggleMode } from "./mode";
import { createStatusBarItem, destroyStatusBarItem, updateStatusBarItem } from "./statusBarItem";

// initialization //////////////////////////////////////////////////////////////

export const activate = (context: vscode.ExtensionContext) => {
    const statusBarItem = createStatusBarItem();
    activeTextEditorChanged();

    context.subscriptions.push(
        vscode.commands.registerCommand("overtype.toggle", toggleCommand),

        vscode.commands.registerCommand("type", typeCommand),
        vscode.commands.registerCommand("paste", pasteCommand),
        vscode.commands.registerCommand("hardBackspace", backspaceCommand),

        vscode.window.onDidChangeActiveTextEditor(activeTextEditorChanged),

        vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration),

        statusBarItem,
    );
}

export const deactivate = () => {
    destroyStatusBarItem();
}

// command handlers ////////////////////////////////////////////////////////////

const activeTextEditorChanged = (textEditor?: vscode.TextEditor) => {
    if (textEditor === undefined) {
        textEditor = vscode.window.activeTextEditor;
    }

    if (textEditor == null) {
        updateStatusBarItem(null);
        updateWhenContext(null);
    } else {
        const mode = getMode(textEditor);
        updateStatusBarItem(mode);
        updateWhenContext(mode);

        // if in overtype mode, set the cursor to secondary style; otherwise, reset to default
        textEditor.options.cursorStyle = mode
            ? configuration.secondaryCursorStyle
            : configuration.defaultCursorStyle;
    }
}

const updateWhenContext = (overtype: boolean | null) => {
    vscode.commands.executeCommand('setContext', 'overtype.isToggledOn', overtype);
};

const toggleCommand = () => {
    const textEditor = vscode.window.activeTextEditor;
    if (textEditor == null) {
        return;
    }

    toggleMode(textEditor);
    activeTextEditorChanged(textEditor);
}

const getShowInStatusBar = (): boolean => {
    if (configuration.labelInsertMode === ""
     && configuration.labelOvertypeMode === "") {
        return true;
    }
    return false;
}

const onDidChangeConfiguration = () => {
    const previousPerEditor = configuration.perEditor;
    const previousShowInStatusBar = getShowInStatusBar();

    const updated = reloadConfiguration();
    if (!updated) { return; }

    const showInStatusBar = getShowInStatusBar();

    // post create / destroy when changed
    if (showInStatusBar !== previousShowInStatusBar) {
        if (showInStatusBar) {
            createStatusBarItem();
        } else {
            destroyStatusBarItem();
        }
    }

    // update state if the per-editor/global configuration option changes
    if (configuration.perEditor !== previousPerEditor) {

        const textEditor = vscode.window.activeTextEditor;
        const mode = textEditor != null ? getMode(textEditor) : null;
        resetModes(mode, configuration.perEditor);
    }

    activeTextEditorChanged();
}

const shouldPerformOvertype = () => {
    if (!vscode.window.activeTextEditor) { return false; }

    const editor = vscode.window.activeTextEditor;
    const mode = getMode(editor);

    return mode;
}

const typeCommand = (args: { text: string }) => {
    if (shouldPerformOvertype()) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            overtypeBeforeType(editor, args.text);
        }
    }

    return vscode.commands.executeCommand("default:type", args);
}

const backspaceCommand = () => {
    if (!shouldPerformOvertype() || !configuration.hardBackspace)
        return vscode.commands.executeCommand("deleteLeft");

    const editor = vscode.window.activeTextEditor
    if (editor) {
        let selection = editor.selection
        if (selection.isEmpty) {
            // select the character to the left of the cursor
            selection = new vscode.Selection(
                selection.start.translate(0, -1),
                selection.start
            )
        }

        // replace text selection with spaces
        const text = editor.document.getText(selection)
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, " ".repeat(text.length))
        })

        // move the cursor to the left if the original selection was empty
        if (editor.selection.isEmpty) {
            const newPos = editor.selection.start.translate(0, -1)
            editor.selection = new vscode.Selection(newPos, newPos)
        }
    }

    return
}

const pasteCommand = (args: { text: string, pasteOnNewLine: boolean }) => {
    if (configuration.paste && shouldPerformOvertype()) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            overtypeBeforePaste(editor, args.text, args.pasteOnNewLine);
        }
    }

    return vscode.commands.executeCommand("default:paste", args);
}
