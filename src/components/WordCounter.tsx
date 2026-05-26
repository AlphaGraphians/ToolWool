'use client';
import React, { useState } from 'react';
import { X, Copy, Trash2, Type } from 'lucide-react';

export function WordCounter({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');

  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n+/).filter(Boolean).length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl glass rounded-3xl overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(45,90,39,0.1)', color: 'var(--accent)' }}>
              <Type className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg">Word Counter</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here..."
            className="w-full flex-1 min-h-[300px] bg-transparent outline-none resize-none text-lg leading-relaxed placeholder:opacity-30"
            style={{ color: 'var(--text-primary)' }}
          />

          {/* Real-time Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Words', value: stats.words },
              { label: 'Characters', value: stats.chars },
              { label: 'Sentences', value: stats.sentences },
              { label: 'Paragraphs', value: stats.paragraphs },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl border transition-all" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">{s.label}</p>
                <p className="text-2xl font-black" style={{ color: 'var(--gold)' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex items-center justify-between bg-black/5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-2">
            <button 
              onClick={() => { navigator.clipboard.writeText(text); alert('Copied!'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--border)] hover:bg-white/10"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
            <button 
              onClick={() => setText('')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--border)] hover:bg-red-500/10 text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <p className="text-[10px] font-medium opacity-40 italic">Real-time analysis powered by ToolWool</p>
        </div>
      </div>
    </div>
  );
}