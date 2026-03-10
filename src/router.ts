import { ConfigManager, RoutingRule } from './configManager';
import { IDEContext } from './contextExtractor';
import { ModelRegistry, ModelRegistryEntry } from './modelRegistry';

export class Router {
    constructor(
        private configManager: ConfigManager,
        private modelRegistry: ModelRegistry
    ) { }

    evaluate(context: IDEContext): ModelRegistryEntry {
        const rules = this.configManager.getRoutingRules();

        for (const rule of rules) {
            if (this.matchesRule(context, rule)) {
                return this.resolveModel(rule.targetModel, rule.fallbackChain);
            }
        }

        // Default Tier 1 Fallback if no rules match or array is empty
        return this.resolveModel('gemini-3-flash', ['claude-4-haiku']);
    }

    private matchesRule(context: IDEContext, rule: RoutingRule): boolean {
        // Evaluate Token Length
        if (rule.conditions.minTokens !== undefined && context.promptLength < rule.conditions.minTokens) {
            return false;
        }

        // Evaluate Language Context
        if (rule.conditions.language && context.languageId !== rule.conditions.language) {
            return false;
        }

        // Evaluate Prompt Heuristic / Task Categorization
        if (rule.conditions.taskType) {
            const task = rule.conditions.taskType.toLowerCase();
            const promptLower = context.prompt.toLowerCase();

            if (task === 'architecture' || task === 'refactor') {
                if (!promptLower.includes('refactor') && !promptLower.includes('architect') && !promptLower.includes('rewrite')) {
                    return false;
                }
            }
            if (task === 'debug') {
                if (!promptLower.includes('debug') && !promptLower.includes('fix') && !context.terminalActive) {
                    return false;
                }
            }
        }

        return true;
    }

    private resolveModel(targetId: string, fallbackChain?: string[]): ModelRegistryEntry {
        const primary = this.modelRegistry.getModel(targetId);
        if (primary) return primary;

        if (fallbackChain) {
            for (const fallbackId of fallbackChain) {
                const fallback = this.modelRegistry.getModel(fallbackId);
                if (fallback) return fallback;
            }
        }

        throw new Error("SmartSwitch Router Error: No valid fallback models found in registry.");
    }
}
