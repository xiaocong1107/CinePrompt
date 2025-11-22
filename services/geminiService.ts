import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ShotAnalysis } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

// Define the schema for structured JSON output with Bilingual support
const shotAnalysisSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      timestamp: {
        type: Type.STRING,
        description: "The start and end time of the shot (e.g., '00:00 - 00:05').",
      },
      startTimeSeconds: {
        type: Type.NUMBER,
        description: "The start time in seconds (e.g., 0, 5.5).",
      },
      descriptionEN: {
        type: Type.STRING,
        description: "A brief visual description of the action in English.",
      },
      descriptionZH: {
        type: Type.STRING,
        description: "Visual description translated into Chinese (中文).",
      },
      aiPromptEN: {
        type: Type.STRING,
        description: "High-quality Midjourney/Stable Diffusion prompt in English.",
      },
      aiPromptZH: {
        type: Type.STRING,
        description: "High-quality AI prompt translated into Chinese (suitable for Chinese AI models).",
      },
      compositionEN: {
        type: Type.STRING,
        description: "Camera angle and framing notes in English.",
      },
      compositionZH: {
        type: Type.STRING,
        description: "Camera angle and framing notes in Chinese.",
      },
      lightingEN: {
        type: Type.STRING,
        description: "Lighting description in English.",
      },
      lightingZH: {
        type: Type.STRING,
        description: "Lighting description in Chinese.",
      }
    },
    required: [
      "timestamp", "startTimeSeconds", 
      "descriptionEN", "descriptionZH", 
      "aiPromptEN", "aiPromptZH", 
      "compositionEN", "compositionZH", 
      "lightingEN", "lightingZH"
    ],
  },
};

export const analyzeVideoShots = async (
  apiKey: string,
  modelName: string,
  videoFile: File,
  baseUrl?: string
): Promise<ShotAnalysis[]> => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  // Initialize GenAI client with optional Base URL for custom endpoints (e.g. Volcengine proxy)
  const ai = new GoogleGenAI({ 
    apiKey, 
    baseUrl: baseUrl || undefined 
  });

  // Prepare video part
  const videoPart = await fileToGenerativePart(videoFile);

  // Prompt engineering - Explicitly asking for bilingual analysis
  const promptText = `
    You are an expert film editor and AI prompt engineer. 
    Analyze the attached video. Break it down into distinct shots or scenes.
    
    For each shot:
    1. Identify the start timestamp.
    2. Provide a visual description in both English and Chinese.
    3. Write a professional AI image generation prompt in English (for Midjourney) and Chinese (for local models).
    4. Analyze Composition and Lighting in both languages.
    
    Ensure the Chinese translations are natural and professional, using correct cinematographic terminology.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName || 'gemini-2.5-flash',
      contents: {
        parts: [videoPart, { text: promptText }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: shotAnalysisSchema,
        systemInstruction: "You are a bilingual assistant (English/Chinese) that deconstructs video into AI prompts.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from model.");
    }

    const data = JSON.parse(text);
    
    // Add IDs for React keys
    return data.map((item: any, index: number) => ({
      ...item,
      id: index,
    }));

  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze video. Check your API Key, Model Name, or Base URL.");
  }
};