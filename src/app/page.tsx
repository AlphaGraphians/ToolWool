'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Moon, Sun, Command, X,
  Type, ImageIcon, Code2, FileText, Ruler, Shuffle,
  ArrowRight, Eraser, FileSpreadsheet, Music, Sparkles, FileSearch, Video as VideoIcon
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { WordCounter } from '@/components/WordCounter';
import { ImageResizer } from '@/components/ImageResizer';
import { JsonFormatter } from '@/components/JsonFormatter';
import { UnitConverter } from '@/components/UnitConverter';
import { RandomGenerator } from '@/components/RandomGenerator';
import { PdfMerger } from '@/components/PdfMerger';
import BgRemover from '@/components/BgRemover';
import ExcelEngine from '@/components/ExcelEngine';
import BeatSync from '@/components/BeatSync';
import PromptGenerator from '@/components/PromptGenerator';
import DocComparator from '@/components/DocComparator';
import dynamic from 'next/dynamic';

const AudioTranscriber = dynamic(
  () => import('@/components/AudioTranscriber'),
  { ssr: false }
);

/* ─── Tool Data ──────────────────────────────────────────────── */
const TOOLS = [
  { id: 'bg-remover',    name: 'AI BG Remover',     desc: 'Remove backgrounds from images instantly using AI.',            cat: 'Image', icon: Eraser },
  { id: 'beat-sync',     name: 'BeatSync Engine',    desc: 'Calculate exact video cut-points based on music BPM & FPS.',    cat: 'Video', icon: VideoIcon },
  { id: 'word-counter',  name: 'Word Counter',      desc: 'Count words, characters, sentences and paragraphs instantly.',   cat: 'Text',  icon: Type },
  { id: 'image-resize',  name: 'Image Resizer',     desc: 'Resize images to exact dimensions while preserving quality.',    cat: 'Image', icon: ImageIcon },
  { id: 'json-format',   name: 'JSON Formatter',    desc: 'Beautify, validate, and minify JSON with syntax highlighting.',      cat: 'Code',  icon: Code2 },
  { id: 'pdf-merge',     name: 'PDF Merger',        desc: 'Combine multiple PDF files into a single document seamlessly.',  cat: 'PDF',   icon: FileText },
  { id: 'unit-convert',  name: 'Unit Converter',    desc: 'Convert between 100+ units of length, weight, and more.',          cat: 'Unit',  icon: Ruler },
  { id: 'random-gen',    name: 'Random Generator',  desc: 'Generate passwords, UUIDs, and lorem ipsum on demand.',               cat: 'Others', icon: Shuffle },
  { id: 'excel-engine',  name: 'Excel Data Engine', desc: 'Analyze, clean and process spreadsheet data with efficiency.', cat: 'Code',  icon: FileSpreadsheet },
  { id: 'prompt-matrix', name: 'Prompt Matrix',     desc: 'Neural hierarchical prompt engineering suite for NPU models.', cat: 'Image', icon: Sparkles },
  { id: 'doc-integrity', name: 'Text Integrity Engine', desc: 'Perform forensic document comparison and text analysis.', cat: 'Text', icon: FileSearch },
  { id: 'audio-transcriber', name: 'Audio to Text', desc: 'Transcribe any audio file into clean text 100% locally in your browser.', cat: 'Audio', icon: Music },
];

const CAT_COLORS: Record<string, string> = {
  Text:   '#2d5a27',
  Image:  '#4a8a42',
  Audio:  '#eab308',
  Video:  '#d97706',
  Code:   '#c9a84c',
  PDF:    '#8a6a2a',
  Unit:   '#5a7e54',
  Others: '#7a8a76',
};

/* ─── Page Component ─────────────────────────────────────────── */
export default function Home() {
  const [category, setCategory] = useState<string | null>(null);
  const [dark, setDark] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tw-theme');
    const prefersDark = saved ? saved === 'dark' : true;
    setDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('tw-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(p => !p);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (cmdOpen) { 
      setQuery(''); 
      setTimeout(() => inputRef.current?.focus(), 60); 
    }
  }, [cmdOpen]);

  const filtered = TOOLS.filter(t => {
    const matchesCat = category === null || t.cat === category;
    const matchesQ = query === '' || 
      t.name.toLowerCase().includes(query.toLowerCase()) || 
      t.desc.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="flex min-h-screen bg-texture">
      <div className="hidden lg:block">
        <Sidebar active={category} onSelect={setCategory} />
      </div>

      <main className="flex-1 lg:ml-[220px] min-h-screen">
        <header className="sticky top-0 z-20 glass border-b border-[var(--border)]">
          <div className="flex items-center h-14 px-5 gap-3">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Search tools…</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            <div className="flex-1" />

            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl border transition-all"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <div className="px-5 sm:px-8 py-8">
          <div className="mb-8 animate-in">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {category ? category : 'All'} Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((tool, i) => {
              const Icon = tool.icon;
              const clr = CAT_COLORS[tool.cat] || '#6b7280';
              return (
                <div
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="tool-card glass rounded-2xl p-5 cursor-pointer group animate-in relative overflow-hidden"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl transition-all group-hover:scale-110" style={{ background: `${clr}15`, color: clr }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: `${clr}12`, color: clr }}>
                      {tool.cat}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{tool.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Render Logic */}
      {activeTool === 'bg-remover' && <BgRemover onClose={() => setActiveTool(null)} />}
      {activeTool === 'beat-sync' && <BeatSync onClose={() => setActiveTool(null)} />}
      {activeTool === 'word-counter' && <WordCounter onClose={() => setActiveTool(null)} />}
      {activeTool === 'image-resize' && <ImageResizer onClose={() => setActiveTool(null)} />}
      {activeTool === 'json-format' && <JsonFormatter onClose={() => setActiveTool(null)} />}
      {activeTool === 'unit-convert' && <UnitConverter onClose={() => setActiveTool(null)} />}
      {activeTool === 'random-gen' && <RandomGenerator onClose={() => setActiveTool(null)} />}
      {activeTool === 'pdf-merge' && <PdfMerger onClose={() => setActiveTool(null)} />}
      {activeTool === 'excel-engine' && <ExcelEngine onClose={() => setActiveTool(null)} />}
      {activeTool === 'prompt-matrix' && <PromptGenerator onClose={() => setActiveTool(null)} />}
      {activeTool === 'doc-integrity' && <DocComparator onClose={() => setActiveTool(null)} />}
      {activeTool === 'audio-transcriber' && <AudioTranscriber onClose={() => setActiveTool(null)} />}
    </div>
  );
}