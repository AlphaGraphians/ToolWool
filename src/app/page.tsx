'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Moon, Sun, Command, X,
  Type, ImageIcon, Code2, FileText, Ruler, Shuffle,
  ArrowRight
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
// 👇 STEP 2.1: WordCounter component ko import kiya
import { WordCounter } from '@/components/WordCounter';
import { ImageResizer } from '@/components/ImageResizer';
import { JsonFormatter } from '@/components/JsonFormatter';
import { UnitConverter } from '@/components/UnitConverter';
import { RandomGenerator } from '@/components/RandomGenerator';
import { PdfMerger } from '@/components/PdfMerger';

/* ─── Tool Data ──────────────────────────────────────────────── */
const TOOLS = [
  { id: 'word-counter',    name: 'Word Counter',       desc: 'Count words, characters, sentences and paragraphs instantly.',                        cat: 'Text',  icon: Type },
  { id: 'image-resize',    name: 'Image Resizer',      desc: 'Resize images to exact dimensions while preserving quality.',                          cat: 'Image', icon: ImageIcon },
  { id: 'json-format',     name: 'JSON Formatter',     desc: 'Beautify, validate, and minify JSON with syntax highlighting.',                         cat: 'Code',  icon: Code2 },
  { id: 'pdf-merge',       name: 'PDF Merger',         desc: 'Combine multiple PDF files into a single document seamlessly.',                         cat: 'PDF',   icon: FileText },
  { id: 'unit-convert',    name: 'Unit Converter',     desc: 'Convert between 100+ units of length, weight, temperature and more.',                  cat: 'Unit',  icon: Ruler },
  { id: 'random-gen',      name: 'Random Generator',   desc: 'Generate passwords, UUIDs, colors, and lorem ipsum on demand.',                        cat: 'Others',icon: Shuffle },
];

const CAT_COLORS: Record<string, string> = {
  Text:   '#2d5a27',
  Image:  '#4a8a42',
  Code:   '#c9a84c',
  PDF:    '#8a6a2a',
  Unit:   '#5a7e54',
  Others: '#7a8a76',
};

/* ─── Page ───────────────────────────────────────────────────── */
export default function Home() {
  const [category, setCategory]     = useState<string | null>(null);
  const [dark, setDark]             = useState(true);
  const [cmdOpen, setCmdOpen]       = useState(false);
  const [query, setQuery]           = useState('');
  const inputRef                    = useRef<HTMLInputElement>(null);
  
  // 👇 STEP 2.2: Yeh track karega ke kaun sa tool is waqt screen par open hai
  const [activeTool, setActiveTool] = useState<string | null>(null);

  /* Dark mode */
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

  /* Ctrl+K */
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
    if (cmdOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [cmdOpen]);

  /* Filtered tools */
  const filtered = TOOLS.filter(t => {
    const matchesCat = category === null || t.cat === category;
    const matchesQ   = query === '' || t.name.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="flex min-h-screen bg-texture">
      {/* Sidebar — hidden on mobile for now */}
      <div className="hidden lg:block">
        <Sidebar active={category} onSelect={setCategory} />
      </div>

      {/* Main */}
      <main className="flex-1 lg:ml-[220px] min-h-screen">
        {/* ─ Top bar ─ */}
        <header className="sticky top-0 z-20 glass border-b border-[var(--border)]">
          <div className="flex items-center h-14 px-5 gap-3">
            {/* Search trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Search tools…</span>
              <div className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <Command className="w-2.5 h-2.5 inline" />
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  K
                </kbd>
              </div>
            </button>

            <div className="flex-1" />

            {/* Theme toggle */}
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl transition-all duration-200"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ─ Content ─ */}
        <div className="px-5 sm:px-8 py-8">
          {/* Hero */}
          <div className="mb-8 animate-in">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {category ? category : 'All'} Tools
            </h2>
            <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              {category ? `Explore ${category.toLowerCase()} utilities` : `${TOOLS.length} premium utilities at your fingertips`}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((tool, i) => {
              const Icon = tool.icon;
              const clr  = CAT_COLORS[tool.cat] || '#6b7280';
              return (
                <div
                  key={tool.id}
                  // 👇 STEP 2.3: Yahan onClick par tool active karne ka function laga diya
                  onClick={() => setActiveTool(tool.id)}
                  className="tool-card glass rounded-2xl p-5 cursor-pointer group animate-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-2.5 rounded-xl transition-all duration-200 group-hover:scale-110"
                      style={{ background: `${clr}15`, color: clr }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${clr}12`, color: clr }}
                    >
                      {tool.cat}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {tool.name}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {tool.desc}
                  </p>

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                    style={{ color: clr }}>
                    <span>Open Tool</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, ${clr}, transparent)` }}
                  />
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 animate-in">
              <p className="text-lg font-bold" style={{ color: 'var(--text-muted)' }}>No tools found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search or category</p>
            </div>
          )}
        </div>
      </main>

      {/* ─── Command Palette ──────────────────────────────────── */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCmdOpen(false)} />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 glass rounded-2xl overflow-hidden modal-in"
            style={{ border: '1px solid var(--border)' }}>
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:font-medium"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Search tools…"
              />
              <button onClick={() => setCmdOpen(false)}
                className="p-1 rounded-md transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
              {filtered.map(tool => {
                const Icon = tool.icon;
                const clr  = CAT_COLORS[tool.cat] || '#6b7280';
                return (
                  <button
                    key={tool.id}
                    // 👇 STEP 2.4: Command palette ke andar click karne se bhi tool khul jaye
                    onClick={() => { setCmdOpen(false); setActiveTool(tool.id); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:scale-[1.01]"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${clr}10`)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="p-1.5 rounded-lg" style={{ background: `${clr}15`, color: clr }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{tool.name}</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: `${clr}12`, color: clr }}>
                      {tool.cat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-2.5 border-t flex items-center gap-4 text-[10px] font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span><kbd className="font-mono">esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}

      {/* 👇 STEP 2.5: Agar 'word-counter' card par click ho, to pop-up modal chal jaye */}
      {activeTool === 'word-counter' && (
  <WordCounter onClose={() => setActiveTool(null)} />
)}

{/* 🚀 ImageResizer ka render yahan add karein */}
{activeTool === 'image-resize' && (
  <ImageResizer onClose={() => setActiveTool(null)} />
)}

{activeTool === 'json-format' && (
      <JsonFormatter onClose={() => setActiveTool(null)} />
    )}

{activeTool === 'unit-convert' && (
  <UnitConverter onClose={() => setActiveTool(null)} />
)}

{activeTool === 'random-gen' && (
  <RandomGenerator onClose={() => setActiveTool(null)} />
)}

{activeTool === 'pdf-merge' && <PdfMerger onClose={() => setActiveTool(null)} />}

    </div>
  );
}