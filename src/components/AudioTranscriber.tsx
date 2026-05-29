'use client';
import React, { useState, useRef } from 'react';
import { FileAudio, Upload, RefreshCw, X, Copy, Check, Loader2 } from 'lucide-react';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTranscription('');
      if (audioRef.current) audioRef.current.src = URL.createObjectURL(selectedFile);
    }
  };

  const startTranscription = async () => {
    if (!file) return;
    setLoading(true);
    setTranscription('');
    setStatus('Initializing Neural Engine...');

    try {
      // Direct dynamic import from CDN for total stability without local npm issues
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
      const { pipeline, env } = await Function(`return import("${cdnUrl}")`)();
      
      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const modelName = langMode === 'en' ? 'Xenova/whisper-tiny.en' : 'Xenova/whisper-base';
      setStatus(`Downloading Neural Weights (~75MB)...`);
      
      const transcriber = await pipeline('automatic-speech-recognition', modelName);

      setStatus('Decoding audio waveform...');
      const audioData = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedAudio = await audioContext.decodeAudioData(audioData);
      const audioBuffer = decodedAudio.getChannelData(0);

      setStatus('Running In-browser Inference...');
      const output = await transcriber(audioBuffer, {
        chunk_length_s: 30,
        stride_length_s: 5,
        task: 'transcribe',
        language: langMode === 'multilingual' ? 'urdu' : 'english',
      });

      setTranscription(output.text);
      setStatus('Success!');
    } catch (error: any) {
      console.error("Critical Execution Halt:", error);
      setStatus('Runtime Error: Resource block.');
      setTranscription(`Engine Error: ${error.message || 'Browser dropped the connection.'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-[#faf9f5] dark:bg-[#061a14] text-[#061a14] dark:text-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/40 dark:border-[#c5a059]/30 h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#c5a059]/20 flex justify-between items-center bg-black/[0.03] dark:bg-black/40 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059] rounded-lg text-black"><FileAudio className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-[#c5a059] italic">AI Audio Transcriber</h2>
              <p className="text-[9px] text-gray-500 dark:text-white/40 font-mono tracking-widest uppercase">Client-Side Neural Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Side Controls */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[#c5a059]/20 p-6 space-y-6 overflow-y-auto flex-shrink-0 bg-white/50 dark:bg-black/20">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Model Tuning</label>
              <div className="grid grid-cols-2 gap-2 bg-black/5 dark:bg-black/30 p-1 rounded-xl">
                <button onClick={() => !loading && setLangMode('en')} className={`py-2 text-[10px] font-black rounded-lg transition-all ${langMode === 'en' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-gray-500'}`}>ENGLISH</button>
                <button onClick={() => !loading && setLangMode('multilingual')} className={`py-2 text-[10px] font-black rounded-lg transition-all ${langMode === 'multilingual' ? 'bg-[#c5a059] text-black shadow-lg' : 'text-gray-500'}`}>URDU / MULTI</button>
              </div>
              
              <div className="border-2 border-dashed border-[#c5a059]/30 rounded-2xl p-6 text-center hover:border-[#c5a059] transition-all relative bg-black/5">
                <input type="file" accept="audio/*" onChange={handleFileChange} disabled={loading} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="w-6 h-6 mx-auto mb-2 text-[#c5a059]" />
                <p className="text-[10px] font-black uppercase text-gray-500 truncate px-2">{file ? file.name : "Choose audio file"}</p>
              </div>

              <button onClick={startTranscription} disabled={!file || loading} className="w-full py-4 bg-[#c5a059] text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#d4b16a] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {loading ? 'Processing...' : 'Run Engine'}
              </button>
            </div>
          </div>

          {/* Transcript Viewport */}
          <div className="flex-1 p-6 bg-black/[0.02] dark:bg-black/20 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Neural Output</span>
              {transcription && (
                <button onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-1.5 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-lg text-[10px] font-bold text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? 'COPIED' : 'COPY'}
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-white dark:bg-black/40 rounded-xl border border-[#c5a059]/10 p-6 overflow-y-auto shadow-inner">
               {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-[#c5a059] font-black text-[10px] uppercase tracking-widest animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" /> 
                  <span className="text-center px-4">{status}</span>
                </div>
              ) : (
                <p className={`text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap ${langMode === 'multilingual' ? 'text-right' : 'text-left'}`} dir={langMode === 'multilingual' ? 'rtl' : 'ltr'}>
                  {transcription || "Engine idle. Upload file and click 'Run Engine' to begin local analysis."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTranscriber;