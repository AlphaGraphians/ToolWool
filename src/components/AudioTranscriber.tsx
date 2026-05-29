"use client";
import React, { useState, useRef } from 'react';
import { FileAudio, Upload, Play, Pause, RefreshCw, X, Copy, Check, Languages, Volume2, Info, Loader2, ArrowLeft } from 'lucide-react';

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
  const [showFullResult, setShowFullResult] = useState<boolean>(false); // Mobile result focus state
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTranscription('');
      setStatus('');
      if (audioRef.current) { audioRef.current.src = URL.createObjectURL(selectedFile); }
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  };

  function enumImport(url: string): Promise<any> {
    return Function(`return import("${url}")`)();
  }

  const startTranscription = async () => {
    if (!file) return;
    setLoading(true);
    setTranscription('');
    setShowFullResult(true); // Result screen par switch karein
    setStatus('Connecting to Web AI Neural Runtime...');

    try {
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
      const { pipeline } = await enumImport(cdnUrl);
      const modelName = langMode === 'en' ? 'Xenova/whisper-tiny.en' : 'Xenova/whisper-base';
      setStatus(`Loading AI Model... First run takes time.`);
      const transcriber = await pipeline('automatic-speech-recognition', modelName);
      
      const audioUrl = URL.createObjectURL(file);
      const options: any = {
        chunk_length_s: 30,
        stride_length_s: 5,
        task: 'transcribe',
        return_timestamps: true,
        repetition_penalty: 1.2,
      };

      if (langMode === 'multilingual') { options.language = 'urdu'; }

      const output = await transcriber(audioUrl, options);
      
      if (output && Array.isArray(output.chunks)) {
        const formattedText = output.chunks.map((chunk: any) => {
          const start = chunk.timestamp[0].toFixed(2);
          return `[${start}s]: ${chunk.text}`;
        }).join('\n\n');
        setTranscription(formattedText);
      } else {
        setTranscription(output.text || 'AI could not recover clear text segments.');
      }
      setStatus('Transcription Completed!');
    } catch (error) {
      console.error(error);
      setStatus('Inference Engine Error.');
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full h-full sm:h-[85vh] max-w-5xl bg-white dark:bg-[#121212] sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/5 flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            {showFullResult && transcription && (
              <button onClick={() => setShowFullResult(false)} className="sm:hidden p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold dark:text-white">AI Audio Transcriber</h2>
              <p className="hidden sm:block text-[10px] text-gray-400 font-bold uppercase tracking-widest">100% Free Client-Side Neural Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Side Control Panel - Hidden on mobile focus result */}
          <div className={`w-full lg:w-80 border-r border-gray-100 dark:border-white/5 p-6 bg-white dark:bg-[#151515] space-y-6 overflow-y-auto ${showFullResult && (loading || transcription) ? 'hidden lg:block' : 'block'}`}>
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Engine Tuning</label>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-black/40 p-1 rounded-xl">
                <button onClick={() => setLangMode('en')} className={`py-2 text-xs font-bold rounded-lg transition-all ${langMode === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500'}`}>English</button>
                <button onClick={() => setLangMode('multilingual')} className={`py-2 text-xs font-bold rounded-lg transition-all ${langMode === 'multilingual' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500'}`}>Urdu / Multi</button>
              </div>

              <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center relative group bg-gray-50/50 dark:bg-transparent">
                <input type="file" accept="audio/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={loading} />
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">{file ? file.name : "Choose audio file"}</p>
              </div>

              {file && (
                <div className="p-3 bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 truncate max-w-[150px]">{file.name}</span>
                  <button onClick={toggleAudio} className="p-2 bg-emerald-600/10 text-emerald-600 rounded-lg hover:bg-emerald-600 transition-all">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              )}

              <button onClick={startTranscription} disabled={!file || loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 transition-all active:scale-95">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span className="tracking-tight uppercase text-xs">{loading ? 'Transcribing...' : 'Transcribe locally'}</span>
              </button>
            </div>
          </div>

          {/* Transcript Viewport - Expands on mobile after start */}
          <div className={`flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-black/20 flex flex-col overflow-hidden ${showFullResult || transcription ? 'flex' : 'hidden lg:flex'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" /> Result Transcript
              </h3>
              {transcription && (
                <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl text-[11px] font-bold hover:shadow-md transition-all">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              )}
            </div>

            <div className="flex-1 w-full bg-white dark:bg-[#181818] rounded-2xl border border-gray-200 dark:border-white/5 p-4 sm:p-6 overflow-y-auto relative shadow-sm">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <p className="text-xs font-bold text-gray-500 text-center animate-pulse">{status}</p>
                </div>
              ) : transcription ? (
                <p className={`text-sm leading-relaxed font-medium text-gray-800 dark:text-gray-200 whitespace-pre-wrap ${langMode === 'multilingual' ? 'text-right font-semibold' : 'text-left'}`} dir={langMode === 'multilingual' ? 'rtl' : 'ltr'}>
                  {transcription}
                </p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8 space-y-2">
                  <FileAudio className="w-10 h-10 opacity-30" />
                  <p className="text-xs font-bold">No transcription active</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3.5 bg-emerald-600/5 border border-emerald-600/10 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
                Processed natively on device. Privacy guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTranscriber;