import * as vscode from 'vscode';
import { Router } from './router';
import { ContextExtractor } from './contextExtractor';

export class StatusBarUIManager {
    private statusBarItem: vscode.StatusBarItem;

    constructor(
        private router: Router,
        private extractor: ContextExtractor,
        context: vscode.ExtensionContext
    ) {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'smartswitch.openSettings';
        context.subscriptions.push(this.statusBarItem);

        // Update on editor change
        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(() => this.update())
        );

        this.update();
        this.statusBarItem.show();
    }

    public update() {
        // Run a lightweight extraction to guess the current likely model tier
        // based on the active file size and language 
        const mockPrompt = ""; // Empty prompt just to check file context
        const context = this.extractor.extract(mockPrompt);

        try {
            const likelyModel = this.router.evaluate(context);

            // Short labels
            let tierLabel = 'Auto';
            if (likelyModel.capabilities.tier === 'fast') tierLabel = 'Auto: Flash/Haiku';
            if (likelyModel.capabilities.tier === 'balanced') tierLabel = 'Auto: Sonnet/Pro';
            if (likelyModel.capabilities.tier === 'heavy') tierLabel = 'Auto: Opus/GPT-5.1';

            this.statusBarItem.text = `$(zap) ${tierLabel}`;
            this.statusBarItem.tooltip = `SmartSwitch Router: Currently optimized for ${likelyModel.label} based on active file.`;
        } catch (e) {
            this.statusBarItem.text = `$(zap) Auto: Unknown`;
        }
    }
}
