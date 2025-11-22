// Define the structure for a single analyzed shot
export interface ShotAnalysis {
  id: number;
  timestamp: string; // e.g., "00:05 - 00:12"
  startTimeSeconds: number; // for seeking
  
  // Bilingual Content
  descriptionEN: string;
  descriptionZH: string;
  
  aiPromptEN: string;
  aiPromptZH: string;
  
  compositionEN: string;
  compositionZH: string;
  
  lightingEN: string;
  lightingZH: string;
}

// Application processing states
export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

// Configuration for the AI model
export interface ModelConfig {
  apiKey: string;
  modelName: string;
  baseUrl?: string; // Optional custom endpoint (e.g., for proxies)
}