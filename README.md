# 🎬 CinePrompt - Video to AI Prompt Generator

**CinePrompt** is a professional video analysis tool built with React and the Google GenAI SDK. It utilizes multimodal LLMs (like Gemini 2.5) to deconstruct video footage into individual shots, generating high-quality AI image prompts (Midjourney/Stable Diffusion) and cinematographic descriptions in both **English** and **Chinese**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)
![Gemini](https://img.shields.io/badge/Google-Gemini_API-8E75B2.svg)

## ✨ Key Features

### 🧠 Multimodal Video Analysis
- **Shot-by-Shot Breakdown**: Automatically detects scene changes and segments the video into distinct shots with precise timestamps.
- **Deep Visual Understanding**: Analyzes composition, lighting, camera angles, and subject matter.

### 🌐 Bilingual Support (CN/EN)
- **Dual-Language Output**: Instantly generates descriptions and prompts in both **English** (for international models like Midjourney) and **Chinese** (for local or Chinese-optimized models).
- **One-Click Switching**: Toggle between English and Chinese views on individual shot cards.

### 🔧 Flexible API Configuration
- **Custom Model Selection**: Use the latest models (e.g., `gemini-2.5-flash`, `gemini-1.5-pro`).
- **Custom Base URL**: Support for API proxies and third-party gateways (e.g., **Volcengine/Volcano Engine** wrappers), allowing access to Gemini models in restricted regions or via enterprise endpoints.

### ⚡ Interactive UI
- **Time-Synced Playback**: Click on any analysis card to instantly seek the video player to that specific shot.
- **One-Click Copy**: Copy optimized AI prompts directly to your clipboard.
- **Cyberpunk Aesthetic**: A sleek, dark-mode interface designed for creative professionals.

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome/Edge recommended).
- An API Key for Google Gemini (or a compatible proxy service).

### Installation & Running

Since this project uses ES Modules over CDN for simplicity:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cineprompt.git
   cd cineprompt
   ```

2. **Serve the application**
   You can use any static file server. For example, using Python or Node's `serve`:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # OR using npx serve
   npx serve .
   ```

3. **Open in Browser**
   Navigate to `http://localhost:8000`.

---

## ⚙️ Configuration

To start analyzing videos, click the **Settings (Gear Icon)** in the top right corner.

| Setting | Description |
| :--- | :--- |
| **API Key** | Your Google Gemini API Key (or proxy key). |
| **Model Name** | The model ID to use. Default is `gemini-2.5-flash`. |
| **Base URL** | (Optional) The endpoint URL. <br> - Leave empty for official Google API (`generativelanguage.googleapis.com`). <br> - Enter your proxy URL (e.g., `https://api.volcengine.com/...`) if using **Volcano Engine** or other gateways. |

---

## 📖 Usage Guide

1. **Upload Video**: Drag and drop a video file (max 50MB recommended for browser performance) into the upload zone.
2. **Analyze**: Click the "Generate Prompts" button. The AI will process the video frames.
3. **Review**:
   - Scroll through the generated cards.
   - Toggle **CN/EN** to see the prompt in your preferred language.
   - Click a card to jump to that moment in the video.
4. **Export**: Click the "Copy" button next to any prompt to paste it into your image generation tool (Midjourney, Stable Diffusion, etc.).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI SDK**: `@google/genai` (Gemini 2.5)
- **Icons**: Lucide React

---

## 📄 License

This project is licensed under the MIT License.
