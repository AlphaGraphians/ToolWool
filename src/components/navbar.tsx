'use client';

import React from 'react';
import { Search, Moon, Sun, Menu, Command } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

interface NavbarProps {
  onSearchOpen: () => void;
  onMenuOpen: () => void;
}

export function Navbar({ onSearchOpen, onMenuOpen }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 glass-panel border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="flex items-center h-14 px-4 gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar — grows to fill space */}
        <button
          onClick={onSearchOpen}
          id="global-search-trigger"
          className="flex-1 max-w-xl flex items-center gap-3 px-4 py-2 rounded-xl
            bg-zinc-100/80 dark:bg-zinc-800/50
            border border-zinc-200/80 dark:border-zinc-700/50
            text-sm text-zinc-400 dark:text-zinc-500
            hover:bg-zinc-200/60 dark:hover:bg-zinc-800
            hover:border-zinc-300 dark:hover:border-zinc-600
            hover:text-zinc-500 dark:hover:text-zinc-400
            transition-all duration-200 group"
          aria-label="Open search"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left font-medium">Search 57 tools…</span>
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 font-mono text-[11px] border border-zinc-300 dark:border-zinc-600">
              <Command className="w-3 h-3 inline" />
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 font-mono text-[11px] border border-zinc-300 dark:border-zinc-600">
              K
            </kbd>
          </div>
        </button>

        {/* Spacer */}
        <div className="flex-1 hidden lg:block" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="relative p-2 rounded-xl border
              border-zinc-200/80 dark:border-zinc-700/50
              bg-zinc-100/80 dark:bg-zinc-800/50
              text-zinc-500 dark:text-zinc-400
              hover:text-zinc-900 dark:hover:text-zinc-100
              hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80
              hover:border-zinc-300 dark:hover:border-zinc-600
              transition-all duration-200 overflow-hidden"
          >
            <div className={`transition-all duration-300 ${theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0 absolute inset-2'}`}>
              <Moon className="w-4 h-4" />
            </div>
            <div className={`transition-all duration-300 ${theme === 'light' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute inset-2'}`}>
              <Sun className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
