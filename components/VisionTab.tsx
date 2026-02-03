
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface VisionTabProps {
  onAction: (detail: string) => void;
}

export const VisionTab: React.FC<VisionTabProps> = ({ onAction }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateVision = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    onAction(`Dreaming up: "${prompt.substring(0, 15)}..."`);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: `A dreamy, high-quality aesthetic digital illustration for Ann Mariya. Theme: ${prompt}. Style: soft pastel colors, ethereal lighting, gentle textures, minimalist, pink and cream tones.` }],
      });

      for (const part of response.candidates?.[0].content.parts || []) {
        if (part.inlineData) {
          setImage(`data:image/png;base64,${part.inlineData.data}`);
          onAction(`Finished painting a dream for her.`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.2em]">Vision</h2>
        <h1 className="text-2xl text-gray-800 font-semibold">Dreamscapes for You</h1>
      </header>

      <div className="relative aspect-[9/12] w-full bg-pink-50/50 rounded-[3rem] overflow-hidden border border-white shadow-lg flex items-center justify-center">
        {image ? (
          <img src={image} alt="Generated vision" className="w-full h-full object-cover animate-in fade-in duration-1000" />
        ) : (
          <div className="text-center px-10 space-y-4">
            <div className="text-5xl opacity-40">🎨</div>
            <p className="text-pink-300 text-sm italic poetic-text text-xl">Describe a feeling...</p>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4 z-10">
            <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="text-pink-600 font-bold uppercase tracking-widest text-[10px] animate-pulse">Mixing colors for you...</p>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A rainy morning in Paris..."
          className="flex-1 bg-white border border-pink-50 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 shadow-inner"
        />
        <button 
          onClick={generateVision}
          disabled={loading}
          className="bg-pink-500 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-pink-600 active:scale-90 transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 1.1a2 2 0 00-2.828 0L10 1.985V14.243z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
