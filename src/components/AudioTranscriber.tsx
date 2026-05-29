'use client';
import React, { useState, useRef } from 'react';
import { FileAudio, Upload, Play, Pause, RefreshCw, X, Copy, Check, Languages, Volume2, Info, Loader2 } from 'lucide-react';

interface AudioTranscriberProps {
  onClose: () => void;
}

const AudioTranscriber: React.FC<AudioTranscriberProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [langMode, setLangMode] = useState<'en' | 'multilingual'>('en');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ... (Logic functions remain same) ...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (audioRef.current) audioRef.current.src = URL.createObjectURL(selectedFile);
    }
  };

  const startTranscription = async () => {
    setLoading(true);
    setStatus('Connecting to Web AI Neural Runtime...');
    // ... (Your existing logic) ...
    setLoading(false);
  };

  function enumImport(url: string): Promise<any> { return Function(`return import("${url}")`)(); }

  const copyToClipboard = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Premium Container with glass effect */}
      <div className="relative w-full max-w-5xl bg-[#faf9f5] dark:bg-[#061a14] text-[#061a14] dark:text-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/40 dark:border-[#c5a059]/30 h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#c5a059]/20 flex justify-between items-center bg-black/[0.03] dark:bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059] rounded-lg text-black">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-[#c5a059] italic">AI Audio Transcriber</h2>
              <p className="text-[9px] text-gray-500 dark:text-white/40 font-mono tracking-widest uppercase">Client-Side Neural Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Controls */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[#c5a059]/20 p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Model Tuning</label>
              <div className="grid grid-cols-2 gap-2 bg-black/5 dark:bg-black/30 p-1 rounded-xl">
                <button onClick={() => setLangMode('en')} className={`py-2 text-[10px] font-black rounded-lg transition-all ${langMode === 'en' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-gray-500'}`}>ENGLISH</button>
                <button onClick={() => setLangMode('multilingual')} className={`py-2 text-[10px] font-black rounded-lg transition-all ${langMode === 'multilingual' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-gray-500'}`}>URDU / MULTI</button>
              </div>
              
              <div className="border-2 border-dashed border-[#c5a059]/30 rounded-2xl p-6 text-center hover:border-[#c5a059] transition-all relative">
                <input type="file" accept="audio/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="w-6 h-6 mx-auto mb-2 text-[#c5a059]" />
                <p className="text-[10px] font-black uppercase text-gray-500">{file ? file.name : "Choose audio file"}</p>
              </div>

              <button onClick={startTranscription} className="w-full py-4 bg-[#c5a059] text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#d4b16a] transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {loading ? 'Transcribing...' : 'Run Engine'}
              </button>
            </div>
          </div>

          {/* Transcript Viewport */}
          <div className="flex-1 p-6 bg-black/[0.02] dark:bg-black/20 flex flex-col overflow-hidden">
            <div className="flex-1 bg-white dark:bg-black/40 rounded-xl border border-[#c5a059]/10 p-6 overflow-y-auto custom-scroll shadow-inner">
               {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-[#c5a059] font-black text-[10px] uppercase tracking-widest animate-pulse">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" /> {status}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-mono">{transcription || "No transcription active..."}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTranscriber;