'use client';

import React from 'react';
import {
  Type, ImageIcon, Code2, FileText, Ruler, MoreHorizontal,
  Layers, ChevronRight, Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { key: 'Text',   label: 'Text',   icon: Type,           color: '#2d5a27' },
  { key: 'Image',  label: 'Image',  icon: ImageIcon,      color: '#4a8a42' },
  { key: 'Code',   label: 'Code',   icon: Code2,          color: '#c9a84c' },
  { key: 'PDF',    label: 'PDF',    icon: FileText,       color: '#8a6a2a' },
  { key: 'Unit',   label: 'Unit',   icon: Ruler,          color: '#5a7e54' },
  { key: 'Others', label: 'Others', icon: MoreHorizontal, color: '#7a8a76' },
] as const;

interface SidebarProps {
  active: string | null;
  onSelect: (key: string | null) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] z-30 flex flex-col glass border-r border-[var(--border)]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d5a27] to-[#c9a84c] flex items-center justify-center shadow-lg">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Tool<span style={{ color: 'var(--gold)' }}>Wool</span>
            </h1>
            <p className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              utility suite
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {/* All */}
        <button
          onClick={() => onSelect(null)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200"
          style={{
            background: active === null ? 'rgba(45,90,39,0.1)' : 'transparent',
            color: active === null ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="flex-1 text-left">All Tools</span>
        </button>

        <div className="pt-3 pb-1.5 px-3">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--text-muted)' }}>
            Categories
          </p>
        </div>

        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 group"
              style={{
                background: isActive ? `${cat.color}15` : 'transparent',
                color: isActive ? cat.color : 'var(--text-secondary)',
              }}
            >
              <div
                className="p-1 rounded-md transition-all"
                style={isActive
                  ? { background: cat.color, boxShadow: `0 2px 8px ${cat.color}40` }
                  : { background: 'var(--bg-secondary)' }
                }
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isActive ? '#fff' : 'var(--text-muted)' }} />
              </div>
              <span className="flex-1 text-left">{cat.label}</span>
              <ChevronRight
                className="w-3 h-3 transition-transform"
                style={{
                  color: isActive ? cat.color : 'var(--text-muted)',
                  transform: isActive ? 'rotate(90deg)' : 'none',
                  opacity: isActive ? 1 : 0.4,
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <div className="rounded-lg p-2.5" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <p className="text-[10px] font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <kbd className="px-1 py-0.5 rounded text-[9px] font-mono font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--gold)' }}>⌘K</kbd>
            {' '}to search tools
          </p>
        </div>
      </div>
    </aside>
  );
}
