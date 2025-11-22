import React, { useState } from 'react';
import { ShotAnalysis } from '../types';
import { Copy, Clock, Aperture, Zap, Languages } from 'lucide-react';

interface ShotCardProps {
  shot: ShotAnalysis;
  onSeek: (time: number) => void;
  isActive: boolean;
}

type Language = 'EN' | 'ZH';

export const ShotCard: React.FC<ShotCardProps> = ({ shot, onSeek, isActive }) => {
  const [lang, setLang] = useState<Language>('ZH'); // Default to Chinese as requested
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to get content based on current language
  const content = {
    description: lang === 'EN' ? shot.descriptionEN : shot.descriptionZH,
    prompt: lang === 'EN' ? shot.aiPromptEN : shot.aiPromptZH,
    composition: lang === 'EN' ? shot.compositionEN : shot.compositionZH,
    lighting: lang === 'EN' ? shot.lightingEN : shot.lightingZH,
    visualLabel: lang === 'EN' ? 'Visual Description' : '画面描述',
    compLabel: lang === 'EN' ? 'Composition' : '构图镜头',
    lightLabel: lang === 'EN' ? 'Lighting' : '光影布局',
    promptLabel: lang === 'EN' ? 'AI Prompt' : 'AI 提示词',
    copyBtn: lang === 'EN' ? 'Copy Prompt' : '复制提示词',
    copiedBtn: lang === 'EN' ? 'Copied!' : '已复制!',
  };

  return (
    <div 
      onClick={() => onSeek(shot.startTimeSeconds)}
      className={`
        group relative p-5 rounded-xl border transition-all duration-200 cursor-pointer
        hover:border-blue-500/50 hover:bg-gray-800/50
        ${isActive 
          ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
          : 'bg-gray-850 border-gray-700'
        }
      `}
    >
      {/* Header: Timestamp and Language Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-sm bg-blue-900/30 px-2 py-1 rounded">
          <Clock size={14} />
          <span>{shot.timestamp}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1 border border-gray-700" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setLang('ZH')}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${lang === 'ZH' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            中文
          </button>
          <button 
            onClick={() => setLang('EN')}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${lang === 'EN' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4">
        <div>
          <h4 className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">{content.visualLabel}</h4>
          <p className="text-gray-200 text-sm leading-relaxed">{content.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1 font-semibold">
                    <Aperture size={12} /> {content.compLabel}
                </div>
                <p className="text-xs text-gray-300">{content.composition}</p>
            </div>
            <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
                <div className="flex items-center gap-1.5 text-yellow-600/80 text-xs mb-1 font-semibold">
                    <Zap size={12} /> {content.lightLabel}
                </div>
                <p className="text-xs text-gray-300">{content.lighting}</p>
            </div>
        </div>

        <div className="relative mt-1">
          <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full opacity-50"></div>
          <div className="flex justify-between items-end mb-2 pl-2">
            <h4 className="text-purple-400 text-xs uppercase tracking-wider font-bold">{content.promptLabel}</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(content.prompt);
              }}
              className={`
                flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors border
                ${copied 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                }
              `}
            >
              {copied ? content.copiedBtn : <><Copy size={12} /> {content.copyBtn}</>}
            </button>
          </div>
          <p className="text-gray-300 text-sm italic bg-black/30 p-3 rounded border border-gray-800/50 font-serif">
            "{content.prompt}"
          </p>
        </div>
      </div>
    </div>
  );
};