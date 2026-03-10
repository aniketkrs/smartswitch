# SmartSwitch AI Router

SmartSwitch is a universal AI model router for VS Code and Google Antigravity. It allows you to intelligently route LLM requests based on custom rules, priorities, and token limits.

## 🚀 Features

- **Smart Routing**: Route requests to different models (Gemini, Claude, etc.) based on task complexity.
- **Local Proxy Server**: Compatible with 3rd party extensions via a built-in Express proxy.
- **Secure Configuration**: Store API keys securely using VS Code's secret storage.
- **Dynamic Status Bar**: Monitor current routing status directly in the UI.

## 🛠️ Installation Guide

1. **Prerequisites**:
   - [Node.js](https://nodejs.org/) (v18 or higher)
   - [Visual Studio Code](https://code.visualstudio.com/) (v1.85.0 or higher)

2. **Setup**:
   - Clone the repository.
   - Run the following command in the project root to install dependencies:
     ```bash
     npm install
     ```

## 🏃 Launching & Testing

To test the extension during development:

1. **Compile**:
   - Run `npm run compile` to build the TypeScript source code.
2. **Open in VS Code**:
   - Open the project folder in VS Code.
3. **Launch Extension**:
   - Press **`F5`** on your keyboard.
   - A new window titled **[Extension Development Host]** will open with SmartSwitch active.
4. **Configure**:
   - In the new window, open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
   - Run `SmartSwitch: Set API Key` to add your keys.
   - Run `SmartSwitch: Configure Models and Rules` to adjust routing logic.

## 📁 Project Structure

- `src/extension.ts`: Main entry point.
- `src/router.ts`: Core routing logic.
- `src/proxyServer.ts`: Local LLM routing proxy.
- `src/configManager.ts`: Configuration and secret management.

---
Built with ❤️ for the Google Antigravity ecosystem.
