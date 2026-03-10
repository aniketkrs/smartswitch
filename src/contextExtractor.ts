import * as vscode from 'vscode';

export interface IDEContext {
    prompt: string;
    languageId: string;
    promptLength: number;
    activeFileComplexity: number;
    terminalActive: boolean;
}

export class ContextExtractor {
    extract(prompt: string): IDEContext {
        const editor = vscode.window.activeTextEditor;

        let languageId = 'unknown';
        let activeFileComplexity = 0;

        if (editor) {
            languageId = editor.document.languageId;
            const lineCount = editor.document.lineCount;
            // Simple heuristic: Larger files are more complex
            activeFileComplexity = lineCount > 500 ? 100 : lineCount > 100 ? 50 : 10;
        }

        // Very basic terminal active check
        const terminalActive = vscode.window.terminals.length > 0;

        return {
            prompt,
            languageId,
            promptLength: prompt.length, // Rough proxy for tokens in MVP
            activeFileComplexity,
            terminalActive
        };
    }
}
