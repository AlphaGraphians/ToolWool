'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSearch, X, BookOpen, Copy, Split, 
  ChevronRight, ArrowRightLeft, FileText, Trash2, AlertCircle
} from 'lucide-react';

interface DocComparatorProps {
  onClose: () => void;
}

export default function DocComparator({ onClose }: DocComparatorProps) {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diffResult, setDiffResult] = useState<{ type: 'added' | 'removed' | 'same', value: string }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Theme Sync Logic
  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setIsDarkMode(root.classList.contains('dark'));
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Basic Diff Algorithm (Word-by-word)
  const runComparison = () => {
    if (!textA || !textB) {
      showToast("Please provide content in both panels");
      return;
    }

    const wordsA = textA.split(/(\s+)/);
    const wordsB = textB.split(/(\s+)/);
    
    // Simple diff logic for shell - can be upgraded to Myers Diff later
    const result: any[] = [];
    const maxLength = Math.max(wordsA.length, wordsB.length);

    for (let i = 0; i < maxLength; i++) {
      if (wordsA[i] === wordsB[i]) {
        result.push({ type: 'same', value: wordsA[i] });
      } else {
        if (wordsA[i]) result.push({ type: 'removed', value: wordsA[i] });
        if (wordsB[i]) result.push({ type: 'added', value: wordsB[i] });
      }
    }
    setDiffResult(result);
    showToast("Analysis Complete");
  };

  const clearPanels = () => {
    setTextA('');
    setTextB('');
    setDiffResult([]);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans animate-in fade-in duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Toast Pill */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] bg-[#c5a059] text-black text-xs font-black px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-5">
          {toast}
        </div>
      )}

      <div className="relative w-full max-w-6xl bg-[#faf9f5] dark:bg-[#061a14] text-[#061a14] dark:text-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/40 dark:border-[#c5a059]/30 h-[90vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-[#c5a059]/20 flex justify-between items-center bg-black/[0.03] dark:bg-black/40">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-[#c5a059] rounded-lg">
              <FileSearch className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#c5a059] italic">Text Integrity Engine</h2>
              <p className="text-[9px] text-gray-500 dark:text-white/40 font-mono tracking-widest uppercase">Forensic Document Comparison Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={clearPanels} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-full transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors border border-black/5 dark:border-white/5">
              <X className="w-5 h-5 text-gray-500 dark:text-white/60" />
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            {/* Panel A */}
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Source Document (A)</label>
              <textarea 
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                placeholder="Paste original text here..."
                className="flex-1 bg-white dark:bg-black/40 border border-gray-200 dark:border-[#c5a059]/20 rounded-xl p-4 text-xs font-mono outline-none focus:border-[#c5a059] transition-all resize-none shadow-inner"
              />
            </div>

            {/* Panel B */}
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Target Document (B)</label>
              <textarea 
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder="Paste modified text here..."
                className="flex-1 bg-white dark:bg-black/40 border border-gray-200 dark:border-[#c5a059]/20 rounded-xl p-4 text-xs font-mono outline-none focus:border-[#c5a059] transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-center">
            <button 
              onClick={runComparison}
              className="px-12 py-4 bg-[#c5a059] text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#d4b16a] transition-all active:scale-[0.98] shadow-2xl flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" /> Run Integrity Check
            </button>
          </div>

          {/* Diff Result Terminal */}
          <div className="h-48 bg-black/5 dark:bg-black/60 rounded-xl border border-[#c5a059]/10 p-4 overflow-y-auto custom-scroll text-left">
            <div className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Split className="w-3 h-3" /> Analysis Result
            </div>
            {diffResult.length === 0 ? (
              <div className="text-[11px] text-gray-400 italic">No analysis performed yet. Run check to see differences...</div>
            ) : (
              <div className="text-[12px] font-mono leading-relaxed whitespace-pre-wrap">
                {diffResult.map((part, i) => (
                  <span 
                    key={i} 
                    className={`${
                      part.type === 'added' ? 'bg-green-500/20 text-green-500 font-bold px-0.5' : 
                      part.type === 'removed' ? 'bg-rose-500/20 text-rose-500 line-through px-0.5' : 
                      'text-gray-500 dark:text-slate-300'
                    }`}
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}