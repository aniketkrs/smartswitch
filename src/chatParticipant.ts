import * as vscode from 'vscode';
import { Router } from './router';
import { ContextExtractor } from './contextExtractor';

export class ChatParticipant {
    constructor(private router: Router, private extractor: ContextExtractor) { }

    register(context: vscode.ExtensionContext) {
        // Create a VS Code Chat Participant
        const participant = vscode.chat.createChatParticipant('smartswitch.agent', async (request, context, response, token) => {
            try {
                // 1. Extract IDE Context
                const ideContext = this.extractor.extract(request.prompt);

                // 2. Route to Best Model
                const bestModel = this.router.evaluate(ideContext);

                // 3. Provide Visual Feedback
                response.markdown(`> ⚡ **SmartSwitch Routed:** Utilizing \`${bestModel.label}\` for this request.\n\n`);

                // 4. In a full implementation, proxy this payload to the selected model's API.
                // Here we mock the behavior for demonstration.
                response.markdown(`Simulated response from ${bestModel.label} fulfilling the request: "${request.prompt}"`);

            } catch (error: any) {
                response.markdown(`**SmartSwitch Error:** ${error.message}`);
            }
        });

        // Add a simple icon
        participant.iconPath = new vscode.ThemeIcon('zap');
        context.subscriptions.push(participant);
    }
}
