import * as vscode from 'vscode';
import express from 'express';
import { Server } from 'http';
import { Router } from './router';
import { ContextExtractor } from './contextExtractor';

export class ProxyServer {
    private app = express();
    private server: Server | null = null;

    constructor(
        private port: number,
        private router: Router,
        private extractor: ContextExtractor
    ) {
        this.app.use(express.json());
        this.setupRoutes();
    }

    private setupRoutes() {
        // Intercept standard OpenAI-compatible chat completions route
        this.app.post('/v1/chat/completions', async (req, res) => {
            try {
                const messages = req.body.messages || [];
                // Extract just the last user message for routing heuristic
                const lastMessage = messages[messages.length - 1]?.content || '';

                const ideContext = this.extractor.extract(lastMessage);
                const bestModel = this.router.evaluate(ideContext);

                console.log(`[SmartSwitch Proxy] Routed to: ${bestModel.id}`);

                // In a production app, we would make an HTTP fetch() to OpenRouter/LiteLLM 
                // using the configManager's getApiKey() and stream the response back to `res`.

                // For demonstration, return a mocked OpenAI-compatible JSON response
                res.status(200).json({
                    id: 'chatcmpl-smartswitch',
                    object: 'chat.completion',
                    created: Math.floor(Date.now() / 1000),
                    model: bestModel.id,
                    choices: [
                        {
                            index: 0,
                            message: {
                                role: 'assistant',
                                content: `[Response via Proxy from ${bestModel.label}] You asked: ${lastMessage}`
                            },
                            finish_reason: 'stop'
                        }
                    ]
                });

            } catch (error: any) {
                res.status(500).json({ error: { message: error.message } });
            }
        });
    }

    start() {
        if (!this.server) {
            this.server = this.app.listen(this.port, () => {
                vscode.window.showInformationMessage(`SmartSwitch Proxy running on http://localhost:${this.port}`);
            });
        }
    }

    stop() {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }
}
