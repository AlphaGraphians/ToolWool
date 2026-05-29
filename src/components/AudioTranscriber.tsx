"use client";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTranscription('');
      setStatus('');
      
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(selectedFile);
      }
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const startTranscription = async () => {
    if (!file) return;

    setLoading(true);
    setTranscription('');
    setStatus('Connecting to Web AI Neural Runtime...');

    try {
      setStatus('Streaming AI sub-modules directly into browser cache...');
      
      // ─── TURBOPACK TOTAL BYPASS ───
      // Direct string evaluation se native browser runtime standard import chalega bina compiler crash ke
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
      const { pipeline } = await enumImport(cdnUrl);
      
      if (!pipeline) {
        throw new Error("Pipeline mapping crashed inside window context.");
      }

      const modelName = langMode === 'en' ? 'Xenova/whisper-tiny.en' : 'Xenova/whisper-base';
      setStatus(`Downloading Neural Weights (${langMode === 'en' ? '~75MB' : '~150MB'}). First run takes time...`);
      
      const transcriber = await pipeline('automatic-speech-recognition', modelName);
      
      setStatus('Decoding audio wave frequencies...');
      const audioUrl = URL.createObjectURL(file);
      
      setStatus('Processing speech pattern (In-browser inference)...');
      
      const options: any = {
        chunk_length_s: 30,
        stride_length_s: 5,
        task: 'transcribe',
      };

      if (langMode === 'multilingual') {
        options.language = 'urdu';
      }

      const output = await transcriber(audioUrl, options);
      
      if (output && (output as any).text) {
        setTranscription((output as any).text);
        setStatus('Transcription Completed!');
      } else {
        setTranscription('AI engine ran successfully but could not recover clear text segments.');
        setStatus('Finished with empty payload.');
      }

    } catch (error) {
      console.error("Critical execution halt:", error);
      setStatus('Runtime environment block or browser script security error.');
      setTranscription('Inference Engine Error: Your browser network dropped the connection or allocation limit reached. Try a shorter file on mobile device.');
    } finally {
      setLoading(false);
    }
  };

  // Compiler manipulation function to perform pure client execution
  function enumImport(url: string): Promise<any> {
    return Function(`return import("${url}")`)();
  }

  const copyToClipboard = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/5 h-[85vh] flex flex-col">
        
        {/* Main Header */}
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white">AI Audio Transcriber</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">100% Free Client-Side Neural Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Side Control Panel */}
          <div className="w-full lg:w-80 border-r border-gray-100 dark:border-white/5 p-6 bg-white dark:bg-[#151515] space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Model Tuning</label>
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" /> Engine / Language Profile
                </span>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-black/40 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                  <button 
                    onClick={() => !loading && setLangMode('en')} 
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${langMode === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500'}`}
                    disabled={loading}
                  >
                    English Only
                  </button>
                  <button 
                    onClick={() => !loading && setLangMode('multilingual')} 
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${langMode === 'multilingual' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500'}`}
                    disabled={loading}
                  >
                    Urdu / Multi
                  </button>
                </div>
              </div>

              {/* Upload Zone */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500">Audio File Source</span>
                <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center hover:border-emerald-500/50 transition-all relative group bg-gray-50/50 dark:bg-transparent">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                    {file ? file.name : "Choose audio file"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">Audio formats up to 25MB</p>
                </div>
              </div>

              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />

              {file && (
                <div className="p-3 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 truncate max-w-[150px]">{file.name}</span>
                  <button 
                    onClick={toggleAudio} 
                    className="p-2 bg-emerald-600/10 text-emerald-600 dark:text-emerald-500 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Process Trigger */}
              <button 
                onClick={startTranscription}
                disabled={!file || loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-600/10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span className="tracking-tight uppercase text-xs">{loading ? 'Transcribing...' : 'Transcribe locally'}</span>
              </button>
            </div>
          </div>

          {/* Transcript Viewport */}
          <div className="flex-1 p-6 bg-gray-50 dark:bg-black/20 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" /> Generated Text Pipeline
              </h3>
              {transcription && (
                <button 
                  onClick={copyToClipboard} 
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl text-[11px] font-bold hover:shadow-md transition-all text-gray-700 dark:text-gray-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Transcript'}
                </button>
              )}
            </div>

            {/* Content Output Box */}
            <div className="flex-1 w-full bg-white dark:bg-[#181818] rounded-2xl border border-gray-200 dark:border-white/5 p-6 overflow-y-auto relative shadow-sm">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <p className="text-xs font-bold text-gray-500 text-center animate-pulse">{status}</p>
                </div>
              ) : transcription ? (
                <p 
                  className={`text-sm leading-relaxed font-medium text-gray-800 dark:text-gray-200 whitespace-pre-wrap ${langMode === 'multilingual' ? 'text-right font-semibold' : 'text-left'}`}
                  dir={langMode === 'multilingual' ? 'rtl' : 'ltr'}
                >
                  {transcription}
                </p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8 space-y-2">
                  <FileAudio className="w-10 h-10 opacity-30" />
                  <p className="text-xs font-bold">No transcription active</p>
                  <p className="text-[11px] max-w-xs opacity-75">Upload an audio file and initiate the local browser engine to extract transcription.</p>
                </div>
              )}
            </div>
            
            {/* Info Footer Callout */}
            <div className="mt-4 p-3.5 bg-emerald-600/5 border border-emerald-600/10 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
                <strong>Privacy Protocol:</strong> Files are processed natively on your CPU/GPU core architecture. No telemetry packets or audio artifacts are synchronized with cloud entities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTranscriber;