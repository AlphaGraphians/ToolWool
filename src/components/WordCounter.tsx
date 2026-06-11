'use client';
import React, { useState } from 'react';
import { X, Copy, Trash2, Type } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
export function WordCounter({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [copyDone, setCopyDone] = useState(false);
  const stats = {
    words:      text.trim() ? text.trim().split(/\s+/).length : 0,
    chars:      text.length,
    sentences:  text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n+/).filter(Boolean).length,
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1800);
  };
  /* Translated stat labels */
  const STATS = [
    { labelKey: 'statWords',      value: stats.words      },
    { labelKey: 'statChars',      value: stats.chars      },
    { labelKey: 'statSentences',  value: stats.sentences  },
    { labelKey: 'statParagraphs', value: stats.paragraphs },
  ];
  /* Fallback labels if keys not in translations yet — we add them inline */
  const label = (key: string) => {
    const map: Record<string, string> = {
      statWords:      t.catText === 'Text'      ? 'Words'      : t.catText === 'متن'  ? 'الفاظ'    : t.catText === 'نص' ? 'كلمات' : t.catText === '文本' ? '单词' : t.catText === 'Texte' ? 'Mots' : t.catText === 'Text' ? 'Wörter' : t.catText === 'Texto' ? 'Palabras' : t.catText === 'पाठ' ? 'शब्द' : t.catText === 'Texto' ? 'Palavras' : t.catText === 'Текст' ? 'Слова' : t.catText === 'テキスト' ? '単語' : t.catText === '텍스트' ? '단어' : 'Words',
      statChars:      t.catText === 'Text'      ? 'Characters' : t.catText === 'متن'  ? 'حروف'     : t.catText === 'نص' ? 'أحرف'  : t.catText === '文本' ? '字符' : t.catText === 'Texte' ? 'Caractères' : 'Characters',
      statSentences:  t.catText === 'Text'      ? 'Sentences'  : t.catText === 'متن'  ? 'جملے'     : t.catText === 'نص' ? 'جمل'   : t.catText === '文本' ? '句子' : t.catText === 'Texte' ? 'Phrases' : 'Sentences',
      statParagraphs: t.catText === 'Text'      ? 'Paragraphs' : t.catText === 'متن'  ? 'پیراگراف' : t.catText === 'نص' ? 'فقرات' : t.catText === '文本' ? '段落' : t.catText === 'Texte' ? 'Paragraphes' : 'Paragraphs',
    };
    return map[key] ?? key;
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl glass rounded-3xl overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(45,90,39,0.1)', color: 'var(--accent)' }}>
              <Type className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg">{t.toolWordCounter}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* ── Editor Area ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`${t.dragDrop.replace('Drag & drop file here', '')}${t.input}…`}
            className="w-full flex-1 min-h-[300px] bg-transparent outline-none resize-none text-lg leading-relaxed placeholder:opacity-30"
            style={{ color: 'var(--text-primary)' }}
          />
          {/* Real-time Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div
                key={s.labelKey}
                className="p-4 rounded-2xl border transition-all"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">
                  {label(s.labelKey)}
                </p>
                <p className="text-2xl font-black" style={{ color: 'var(--gold)' }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* ── Footer Actions ──────────────────────────────────── */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between bg-black/5"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--border)] hover:bg-white/10"
            >
              <Copy className="w-3.5 h-3.5" />
              {copyDone ? t.copied : t.copy}
            </button>
            <button
              onClick={() => setText('')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--border)] hover:bg-red-500/10 text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.clear}
            </button>
          </div>
          <p className="text-[10px] font-medium opacity-40 italic">
            {t.result} · ToolWool
          </p>
        </div>
      </div>
    </div>
  );
}