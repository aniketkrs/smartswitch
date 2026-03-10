import * as vscode from 'vscode';

export interface RoutingRule {
    ruleName: string;
    priority: number;
    conditions: {
        minTokens?: number;
        taskType?: string;
        language?: string;
    };
    targetModel: string;
    fallbackChain?: string[];
}

export class ConfigManager {
    constructor(private secretStorage: vscode.SecretStorage) { }

    // Securely store API key
    async setApiKey(providerId: string, key: string): Promise<void> {
        await this.secretStorage.store(`smartswitch_${providerId}_key`, key);
    }

    // Securely retrieve API key
    async getApiKey(providerId: string): Promise<string | undefined> {
        return await this.secretStorage.get(`smartswitch_${providerId}_key`);
    }

    // Retrieve routing rules from vscode settings
    getRoutingRules(): RoutingRule[] {
        const config = vscode.workspace.getConfiguration('smartswitch');
        const rules = config.get<RoutingRule[]>('routingRules') || [];
        // Sort rules by priority descending (highest priority executes first)
        return rules.sort((a, b) => b.priority - a.priority);
    }

    // Retrieve proxy port
    getProxyPort(): number {
        const config = vscode.workspace.getConfiguration('smartswitch');
        return config.get<number>('proxyPort') || 11434;
    }
}
