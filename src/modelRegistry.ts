export interface ModelRegistryEntry {
    id: string; // e.g., 'anthropic/claude-4-opus', 'gemini-3-flash'
    label: string;
    provider: 'anthropic' | 'google' | 'openai' | 'openrouter' | 'local';
    baseUrl?: string; // Optional custom gateway (e.g. OpenRouter or LiteLLM proxy)
    apiKeyRef?: string; // Key map for ConfigManager secret storage
    capabilities: {
        maxTokens: number;
        supportsVision?: boolean;
        tier: 'fast' | 'balanced' | 'heavy';
    };
}

// In a real product, this would be loaded from a JSON configuration file
// or extended dynamically by users. Here we provide the default defaults.
export const defaultModelRegistry: ModelRegistryEntry[] = [
    {
        id: 'gemini-3-flash',
        label: 'Gemini 3 Flash',
        provider: 'google',
        capabilities: { maxTokens: 1048576, tier: 'fast', supportsVision: true }
    },
    {
        id: 'claude-4-haiku',
        label: 'Claude 4 Haiku',
        provider: 'anthropic',
        capabilities: { maxTokens: 200000, tier: 'fast', supportsVision: true }
    },
    {
        id: 'claude-4-sonnet',
        label: 'Claude 4 Sonnet',
        provider: 'anthropic',
        capabilities: { maxTokens: 200000, tier: 'balanced', supportsVision: true }
    },
    {
        id: 'claude-4-opus',
        label: 'Claude 4 Opus',
        provider: 'anthropic',
        capabilities: { maxTokens: 200000, tier: 'heavy', supportsVision: true }
    },
    {
        id: 'gpt-5.1',
        label: 'GPT-5.1',
        provider: 'openai',
        capabilities: { maxTokens: 128000, tier: 'heavy', supportsVision: true }
    }
];

export class ModelRegistry {
    private models: Map<string, ModelRegistryEntry> = new Map();

    constructor() {
        // Load defaults
        defaultModelRegistry.forEach(m => this.models.set(m.id, m));
    }

    // Add a custom model (e.g. proxy specific)
    registerModel(entry: ModelRegistryEntry) {
        this.models.set(entry.id, entry);
    }

    getModel(id: string): ModelRegistryEntry | undefined {
        return this.models.get(id);
    }
}
