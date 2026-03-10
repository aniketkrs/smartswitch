import * as vscode from 'vscode';
import { ConfigManager } from './configManager';
import { ModelRegistry } from './modelRegistry';
import { ContextExtractor } from './contextExtractor';
import { Router } from './router';
import { ChatParticipant } from './chatParticipant';
import { ProxyServer } from './proxyServer';
import { StatusBarUIManager } from './statusBar';

export async function activate(context: vscode.ExtensionContext) {
    console.log('SmartSwitch AI Router is now active!');

    // Initialize Core Dependencies
    const configManager = new ConfigManager(context.secrets);
    const modelRegistry = new ModelRegistry();
    const contextExtractor = new ContextExtractor();
    const router = new Router(configManager, modelRegistry);

    // Initialize Integration Layers
    const chatParticipant = new ChatParticipant(router, contextExtractor);
    chatParticipant.register(context);

    // Start Local Proxy Server for 3rd Party Extensions
    const proxyPort = configManager.getProxyPort();
    const proxyServer = new ProxyServer(proxyPort, router, contextExtractor);
    proxyServer.start();

    // Initialize UI
    const statusBar = new StatusBarUIManager(router, contextExtractor, context);

    // Register Commands
    const setApiKeyCommand = vscode.commands.registerCommand('smartswitch.setApiKey', async () => {
        const key = await vscode.window.showInputBox({
            prompt: 'Enter your API Key (e.g., OpenRouter or specific provider)',
            password: true,
        });
        if (key) {
            await configManager.setApiKey('default_gateway', key);
            vscode.window.showInformationMessage('SmartSwitch: API Key saved securely.');
        }
    });

    const openSettingsCommand = vscode.commands.registerCommand('smartswitch.openSettings', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'smartswitch');
    });

    context.subscriptions.push(
        setApiKeyCommand,
        openSettingsCommand,
        { dispose: () => proxyServer.stop() }
    );
}

export function deactivate() {
    console.log('SmartSwitch AI Router is deactivating...');
}
