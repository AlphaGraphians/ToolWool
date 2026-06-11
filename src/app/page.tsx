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
import { AiUpscaler } from '@/components/AiUpscaler';
import { JsonFormatter } from '@/components/JsonFormatter';
import { UnitConverter } from '@/components/UnitConverter';
import { RandomGenerator } from '@/components/RandomGenerator';
import { PdfMerger } from '@/components/PdfMerger';
import BgRemover from '@/components/BgRemover';
import ExcelEngine from '@/components/ExcelEngine';
import BeatSync from '@/components/BeatSync';
import PromptGenerator from '@/components/PromptGenerator';
import DocComparator from '@/components/DocComparator';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { useLanguage } from '@/context/LanguageContext';
import type { Translations } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';
const AudioTranscriber = dynamic(
  () => import('@/components/AudioTranscriber'),
  { ssr: false }
);
/* ─── Tool ID → Translation key map ─────────────────────────── */
const TOOL_TRANS: Record<string, { name: keyof Translations; desc: keyof Translations; cat: keyof Translations }> = {
  'bg-remover':        { name: 'toolBgRemover',        desc: 'descBgRemover',        cat: 'catImage'  },
  'beat-sync':         { name: 'toolBeatSync',          desc: 'descBeatSync',          cat: 'catVideo'  },
  'word-counter':      { name: 'toolWordCounter',        desc: 'descWordCounter',        cat: 'catText'   },
  'image-resize':      { name: 'toolImageResizer',       desc: 'descImageResizer',       cat: 'catImage'  },
  'image-upscale':     { name: 'toolAiUpscaler',         desc: 'descAiUpscaler',         cat: 'catImage'  },
  'json-format':       { name: 'toolJsonFormatter',      desc: 'descJsonFormatter',      cat: 'catCode'   },
  'pdf-merge':         { name: 'toolPdfMerger',          desc: 'descPdfMerger',          cat: 'catPDF'    },
  'unit-convert':      { name: 'toolUnitConverter',      desc: 'descUnitConverter',      cat: 'catUnit'   },
  'random-gen':        { name: 'toolRandomGenerator',    desc: 'descRandomGenerator',    cat: 'catOthers' },
  'excel-engine':      { name: 'toolExcelEngine',        desc: 'descExcelEngine',        cat: 'catCode'   },
  'prompt-matrix':     { name: 'toolPromptMatrix',       desc: 'descPromptMatrix',       cat: 'catImage'  },
  'doc-integrity':     { name: 'toolDocIntegrity',       desc: 'descDocIntegrity',       cat: 'catText'   },
  'audio-transcriber': { name: 'toolAudioTranscriber',   desc: 'descAudioTranscriber',   cat: 'catAudio'  },
};
/* ─── Tool Data (internal — raw cat key used for filtering only) */
const TOOLS = [
  { id: 'bg-remover',        cat: 'Image', icon: Eraser        },
  { id: 'beat-sync',         cat: 'Video', icon: VideoIcon      },
  { id: 'word-counter',      cat: 'Text',  icon: Type           },
  { id: 'image-resize',      cat: 'Image', icon: ImageIcon      },
  { id: 'image-upscale',     cat: 'Image', icon: Sparkles       },
  { id: 'json-format',       cat: 'Code',  icon: Code2          },
  { id: 'pdf-merge',         cat: 'PDF',   icon: FileText       },
  { id: 'unit-convert',      cat: 'Unit',  icon: Ruler          },
  { id: 'random-gen',        cat: 'Others',icon: Shuffle        },
  { id: 'excel-engine',      cat: 'Code',  icon: FileSpreadsheet},
  { id: 'prompt-matrix',     cat: 'Image', icon: Sparkles       },
  { id: 'doc-integrity',     cat: 'Text',  icon: FileSearch     },
  { id: 'audio-transcriber', cat: 'Audio', icon: Music          },
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
  const { t } = useLanguage();
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
  const filtered = TOOLS.filter(tool => {
    const matchesCat = category === null || tool.cat === category;
    const trans = TOOL_TRANS[tool.id];
    const toolName = trans ? String(t[trans.name]) : '';
    const toolDesc = trans ? String(t[trans.desc]) : '';
    const matchesQ =
      query === '' ||
      toolName.toLowerCase().includes(query.toLowerCase()) ||
      toolDesc.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQ;
  });
  return (
    <div className="flex min-h-screen bg-texture">
      <div className="hidden lg:block">
        <Sidebar active={category} onSelect={setCategory} />
      </div>
      <main className="flex-1 lg:ml-[220px] min-h-screen">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 glass border-b border-[var(--border)]">
          <div className="flex items-center h-14 px-5 gap-3">
            {/* Search bar */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{t.searchPlaceholder}</span>
              <kbd
                className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>
            <div className="flex-1" />
            {/* Language Dropdown — upper right */}
            <LanguageDropdown />
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl border transition-all"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>
        {/* ── Main content ────────────────────────────────────── */}
        <div className="px-5 sm:px-8 py-8">
          <div className="mb-8 animate-in">
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {category
                ? `${t[TOOL_TRANS[TOOLS.find(tool => tool.cat === category)?.id ?? '']?.cat] ?? category} ${t.toolsHeading}`
                : t.allToolsHeading
              }
            </h2>
          </div>
          {/* ── Tool Cards Grid ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((tool, i) => {
              const Icon = tool.icon;
              const clr = CAT_COLORS[tool.cat] || '#6b7280';
              const trans = TOOL_TRANS[tool.id];
              const toolName = trans ? String(t[trans.name]) : tool.id;
              const toolDesc = trans ? String(t[trans.desc]) : '';
              const toolCat  = trans ? String(t[trans.cat])  : tool.cat;
              return (
                <div
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="tool-card glass rounded-2xl p-5 cursor-pointer group animate-in relative overflow-hidden"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-2.5 rounded-xl transition-all group-hover:scale-110"
                      style={{ background: `${clr}15`, color: clr }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: `${clr}12`, color: clr }}
                    >
                      {toolCat}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {toolName}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {toolDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      {/* ── Command Palette ──────────────────────────────────── */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCmdOpen(false)} />
          <div
            className="relative w-full max-w-lg mx-4 rounded-2xl border overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:opacity-50"
                style={{ color: 'var(--text-primary)' }}
              />
              <button onClick={() => setCmdOpen(false)}>
                <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {t.searchNoResults} &ldquo;{query}&rdquo;
                </p>
              ) : (
                filtered.map(tool => {
                  const Icon = tool.icon;
                  const clr = CAT_COLORS[tool.cat] || '#6b7280';
                  const trans = TOOL_TRANS[tool.id];
                  const toolName = trans ? String(t[trans.name]) : tool.id;
                  const toolDesc = trans ? String(t[trans.desc]) : '';
                  return (
                    <button
                      key={tool.id}
                      onClick={() => { setActiveTool(tool.id); setCmdOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:opacity-80"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div className="p-2 rounded-lg shrink-0" style={{ background: `${clr}15`, color: clr }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{toolName}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{toolDesc}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── Tool Panels ──────────────────────────────────────── */}
      {activeTool === 'bg-remover'        && <BgRemover       onClose={() => setActiveTool(null)} />}
      {activeTool === 'beat-sync'         && <BeatSync        onClose={() => setActiveTool(null)} />}
      {activeTool === 'word-counter'      && <WordCounter      onClose={() => setActiveTool(null)} />}
      {activeTool === 'image-resize'      && <ImageResizer     onClose={() => setActiveTool(null)} />}
      {activeTool === 'image-upscale'     && <AiUpscaler       onClose={() => setActiveTool(null)} />}
      {activeTool === 'json-format'       && <JsonFormatter    onClose={() => setActiveTool(null)} />}
      {activeTool === 'unit-convert'      && <UnitConverter    onClose={() => setActiveTool(null)} />}
      {activeTool === 'random-gen'        && <RandomGenerator  onClose={() => setActiveTool(null)} />}
      {activeTool === 'pdf-merge'         && <PdfMerger        onClose={() => setActiveTool(null)} />}
      {activeTool === 'excel-engine'      && <ExcelEngine      onClose={() => setActiveTool(null)} />}
      {activeTool === 'prompt-matrix'     && <PromptGenerator  onClose={() => setActiveTool(null)} />}
      {activeTool === 'doc-integrity'     && <DocComparator    onClose={() => setActiveTool(null)} />}
      {activeTool === 'audio-transcriber' && <AudioTranscriber onClose={() => setActiveTool(null)} />}
    </div>
  );
}