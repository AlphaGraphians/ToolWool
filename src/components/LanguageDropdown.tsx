'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, useLanguage, type LangCode } from '@/context/LanguageContext';

export function LanguageDropdown() {
  const { lang, setLang, currentLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (code: LangCode) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative" style={{ direction: 'ltr' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(p => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 text-[13px] font-medium select-none"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: open ? 'var(--accent, #4a8a42)' : 'var(--border)',
          color: 'var(--text-secondary)',
          boxShadow: open ? '0 0 0 2px var(--accent-soft, rgba(74,138,66,0.15))' : 'none',
        }}
      >
        {/* Flag */}
        <span className="text-lg leading-none" aria-hidden="true">
          {currentLang.flag}
        </span>

        {/* Native name — hidden on very small screens */}
        <span className="hidden sm:inline whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
          {currentLang.nativeName}
        </span>

        {/* Chevron */}
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200 shrink-0"
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute top-full mt-2 right-0 z-50 rounded-2xl border overflow-hidden"
          style={{
            background: 'var(--bg-card, var(--bg-secondary))',
            borderColor: 'var(--border)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)',
            minWidth: '210px',
            maxHeight: '380px',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest border-b"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            Select Language
          </div>

          {/* Language List */}
          <ul className="py-1">
            {LANGUAGES.map((language) => {
              const isActive = language.code === lang;
              return (
                <li key={language.code}>
                  <button
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(language.code)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 group"
                    style={{
                      background: isActive ? 'var(--accent-soft, rgba(74,138,66,0.12))' : 'transparent',
                      color: isActive ? 'var(--accent, #4a8a42)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-secondary)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    {/* Flag */}
                    <span className="text-xl leading-none w-7 text-center shrink-0" aria-hidden="true">
                      {language.flag}
                    </span>

                    {/* Names */}
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-semibold truncate">
                        {language.nativeName}
                      </span>
                      <span
                        className="block text-[11px] truncate"
                        style={{ color: isActive ? 'var(--accent, #4a8a42)' : 'var(--text-muted)' }}
                      >
                        {language.name}
                      </span>
                    </span>

                    {/* Active check */}
                    {isActive && (
                      <Check
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: 'var(--accent, #4a8a42)' }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
