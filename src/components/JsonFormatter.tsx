'use client';
import React, { useState } from 'react';
import { X, Code2, Copy, Trash2, AlignLeft, Minimize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
export function JsonFormatter({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  /* Derived labels */
  const prettifyLabel = t.beautify;
  const minifyLabel   = t.minify;
  const placeholderLabel = t.catCode === 'Code' ? 'Paste your JSON here… e.g. {"name": "ToolWool"}' : t.catCode === 'کوڈ' ? 'اپنا JSON یہاں پیسٹ کریں…' : t.catCode === 'كود' ? 'الصق JSON هنا…' : t.catCode === '代码' ? '在此粘贴 JSON…' : t.catCode === 'Code' ? 'Collez votre JSON ici…' : t.catCode === 'کوڈ' ? 'JSON hier einfügen…' : t.catCode === 'Código' ? 'Pega tu JSON aquí…' : t.catCode === 'कोड' ? 'यहाँ JSON पेस्ट करें…' : t.catCode === 'Código' ? 'Cole seu JSON aqui…' : t.catCode === 'Код' ? 'Вставьте JSON сюда…' : t.catCode === 'コード' ? 'JSONをここに貼り付けてください…' : t.catCode === '코드' ? 'JSON을 여기에 붙여넣으세요…' : 'Paste your JSON here…';
  const handleFormat = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleMinify = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1800);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-5xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{t.toolJsonFormatter}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-[var(--gold)]">
                Developer Utility
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* ── Editor Area ─────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderLabel}
            className="w-full flex-1 p-6 bg-black/20 rounded-2xl outline-none font-mono text-sm leading-relaxed border border-[var(--border)] resize-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
              ⚠️ {t.error}: {error}
            </div>
          )}
        </div>
        {/* ── Footer Actions ──────────────────────────────────── */}
        <div
          className="px-8 py-5 border-t flex flex-wrap items-center justify-between gap-4 bg-black/5"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex gap-3">
            <button
              onClick={handleFormat}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-[var(--gold)] text-[var(--bg-primary)]"
            >
              <AlignLeft className="w-4 h-4" /> {prettifyLabel}
            </button>
            <button
              onClick={handleMinify}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-[var(--border)] hover:bg-white/5"
            >
              <Minimize2 className="w-4 h-4" /> {minifyLabel}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              title={copyDone ? t.copied : t.copy}
              className="p-3 rounded-xl border border-[var(--border)] hover:bg-white/5 transition-all text-[var(--text-secondary)] relative"
            >
              <Copy className="w-4 h-4" />
              {copyDone && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-1 rounded-lg bg-black/70 text-white whitespace-nowrap">
                  {t.copied}
                </span>
              )}
            </button>
            <button
              onClick={() => { setInput(''); setError(null); }}
              className="p-3 rounded-xl border border-[var(--border)] hover:bg-red-500/10 text-red-500 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}