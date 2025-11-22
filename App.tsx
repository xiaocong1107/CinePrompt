import React, { useState, useRef } from 'react';
import { Upload, Settings, Video, Loader2, AlertCircle, Wand2, X, Globe2 } from 'lucide-react';
import { analyzeVideoShots } from './services/geminiService';
import { ShotAnalysis, AppStatus, ModelConfig } from './types';
import VideoPlayer, { VideoPlayerRef } from './components/VideoPlayer';
import { ShotCard } from './components/ShotCard';

// Default Environment variable or user input
const DEFAULT_MODEL = "gemini-2.5-flash";

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [results, setResults] = useState<ShotAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  
  // Config State
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ModelConfig>({
    apiKey: process.env.API_KEY || '',
    modelName: DEFAULT_MODEL,
    baseUrl: ''
  });

  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic client-side size check (warn if > 50MB for browser stability)
      if (file.size > 50 * 1024 * 1024) {
        setError("Warning: File is larger than 50MB. Browser processing might be slow or crash.");
      } else {
        setError(null);
      }
      setVideoFile(file);
      setResults([]);
      setStatus(AppStatus.IDLE);
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;
    if (!config.apiKey) {
      setError("Please enter an API Key in settings.");
      setShowConfig(true);
      return;
    }

    setStatus(AppStatus.ANALYZING);
    setError(null);

    try {
      const analysis = await analyzeVideoShots(config.apiKey, config.modelName, videoFile, config.baseUrl);
      setResults(analysis);
      setStatus(AppStatus.COMPLETE);
    } catch (err: any) {
      setError(err.message);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleSeek = (time: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(time);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Video className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight">CinePrompt <span className="text-xs font-normal text-gray-400 ml-1 px-2 py-0.5 bg-gray-800 rounded-full">CN/EN</span></span>
          </div>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
            title="API Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">API Configuration</h3>
              <button onClick={() => setShowConfig(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                  placeholder="Enter your API Key"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-600 mt-1">Required for access.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Model Name</label>
                <input
                  type="text"
                  value={config.modelName}
                  onChange={(e) => setConfig({...config, modelName: e.target.value})}
                  placeholder="e.g. gemini-2.5-flash"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                />
                <p className="text-xs text-gray-600 mt-1">Use 'gemini-2.5-flash' or specific endpoint models.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Base URL (Optional)</label>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                  placeholder="https://generativelanguage.googleapis.com"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                />
                <p className="text-xs text-gray-600 mt-1">Use for proxy services (e.g. Volcengine wrapper) or custom gateways.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Top Section: Upload & Player */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            {videoFile ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                    <Video size={18} className="text-blue-500"/> 
                    {videoFile.name}
                  </h2>
                  <button 
                    onClick={() => { setVideoFile(null); setResults([]); setStatus(AppStatus.IDLE); }}
                    className="text-sm text-red-400 hover:text-red-300 underline"
                  >
                    Remove Video
                  </button>
                </div>
                <VideoPlayer 
                  ref={videoPlayerRef}
                  file={videoFile} 
                  onTimeUpdate={setCurrentVideoTime}
                />
              </div>
            ) : (
              <div className="h-[400px] border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/30 flex flex-col items-center justify-center text-center group hover:border-blue-500/30 transition-colors relative overflow-hidden">
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="p-4 rounded-full bg-gray-800/50 mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-200 mb-2">Upload a video file</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Drag and drop or click to browse. <br/>
                  Max size recommended: 50MB (Browser limitation).
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: Actions & Status */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Wand2 size={18} className="text-purple-500" />
                  AI Analysis
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Deconstruct your video into distinct shots and generate bilingual (CN/EN) professional prompts using {config.modelName}.
                </p>
                
                {status === AppStatus.ERROR && error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex gap-2 text-sm text-red-200">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p className="break-words">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!videoFile || status === AppStatus.ANALYZING}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
                    ${!videoFile 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : status === AppStatus.ANALYZING
                        ? 'bg-blue-600/50 text-blue-100 cursor-wait'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                    }
                  `}
                >
                  {status === AppStatus.ANALYZING ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Analyzing...
                    </>
                  ) : status === AppStatus.COMPLETE ? (
                    <>Re-Analyze Video</>
                  ) : (
                    <>Generate Prompts</>
                  )}
                </button>
              </div>

              {/* Stats (Only show if results exist) */}
              {results.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <p className="text-gray-500 text-xs uppercase">Total Shots</p>
                    <p className="text-2xl font-bold text-white">{results.length}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <p className="text-gray-500 text-xs uppercase">Languages</p>
                    <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">CN</span>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">EN</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Shot Breakdown</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                   <Globe2 size={14} />
                   <span>Switch languages on individual cards</span>
                </div>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((shot) => {
                    // Determine if this shot is currently playing
                    const isLast = shot.id === results.length - 1;
                    const nextStart = isLast ? 99999 : results[shot.id + 1].startTimeSeconds;
                    const isActive = currentVideoTime >= shot.startTimeSeconds && currentVideoTime < nextStart;

                    return (
                        <ShotCard 
                            key={shot.id} 
                            shot={shot} 
                            onSeek={handleSeek} 
                            isActive={isActive}
                        />
                    );
                })}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}