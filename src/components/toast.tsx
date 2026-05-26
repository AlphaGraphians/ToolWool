'use client';

import React, { useEffect, useState } from 'react';
import { Clipboard, ArrowRight, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  toolId: string;
  pastedContent: string;
}

interface ClipboardToastProps {
  onOpenTool: (toolId: string, initialValue?: string) => void;
}

export function ClipboardToast({ onOpenTool }: ClipboardToastProps) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing in standard textareas or inputs
      const activeElement = document.activeElement?.tagName;
      if (activeElement === 'INPUT' || activeElement === 'TEXTAREA') {
        return;
      }

      const text = e.clipboardData?.getData('text') || '';
      detectContent(text);
    };

    const handleFocus = async () => {
      try {
        // Safe query for clipboard permissions
        const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
        if (permission.state === 'granted') {
          const text = await navigator.clipboard.readText();
          detectContent(text, true); // Silent check on focus
        }
      } catch (err) {
        // Clipboard api not supported or denied, ignore silently
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const detectContent = (text: string, silentOnNoMatch = false) => {
    if (!text || text.trim().length < 3) return;
    const cleanText = text.trim();

    let detected: { text: string; toolId: string } | null = null;

    // 1. JSON Detection
    if (
      (cleanText.startsWith('{') && cleanText.endsWith('}')) ||
      (cleanText.startsWith('[') && cleanText.endsWith(']'))
    ) {
      try {
        JSON.parse(cleanText);
        detected = { text: 'Detected JSON structure.', toolId: 'json-formatter' };
      } catch (e) {}
    }
    
    // 2. JWT Detection
    if (!detected && /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(cleanText)) {
      detected = { text: 'Detected JWT Token.', toolId: 'jwt-debugger' };
    }

    // 3. URL Detection
    if (!detected && /^(https?:\/\/[^\s]+)$/i.test(cleanText)) {
      detected = { text: 'Detected URL link.', toolId: 'url-codec' };
    }

    // 4. Color Code Detection (Hex/RGB/HSL)
    if (!detected && (/^#([A-Fa-f0-9]{3,4}){1,2}$/.test(cleanText) || /^rgba?\(.*\)$/i.test(cleanText))) {
      detected = { text: 'Detected color value.', toolId: 'color-picker' };
    }

    // 5. XML / HTML Detection
    if (!detected && /^<([a-z1-6]+)([^>]+)*(?:>(.*)<\/\1>|\s*\/>)$/i.test(cleanText.replace(/\n/g, ''))) {
      detected = { text: 'Detected XML/HTML markup.', toolId: 'xml-formatter' };
    }

    // 6. CSV Tabular Detection
    if (!detected && cleanText.includes('\n') && cleanText.split('\n')[0].includes(',')) {
      const rows = cleanText.split('\n');
      if (rows.length >= 2 && rows[0].split(',').length === rows[1].split(',').length) {
        detected = { text: 'Detected CSV format.', toolId: 'csv-to-json' };
      }
    }

    // 7. Base64 Detection
    if (!detected && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(cleanText) && cleanText.length > 10) {
      detected = { text: 'Detected Base64 string.', toolId: 'base64-codec' };
    }

    if (detected) {
      // Avoid re-showing the same toast repeatedly within a short window
      const lastPasted = localStorage.getItem('last-detected-paste');
      if (lastPasted === cleanText && silentOnNoMatch) return;

      localStorage.setItem('last-detected-paste', cleanText);

      setToast({
        id: Math.random().toString(),
        text: detected.text,
        toolId: detected.toolId,
        pastedContent: cleanText,
      });
      setVisible(true);
    }
  };

  const handleAction = () => {
    if (toast) {
      onOpenTool(toast.toolId, toast.pastedContent);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => setToast(null), 300);
  };

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-full transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="glass-panel rounded-2xl p-4 flex items-start gap-4 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600" />
        
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Clipboard className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
            Smart Clip System
          </p>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
            {toast.text}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
            &quot;{toast.pastedContent.substring(0, 40)}...&quot;
          </p>
          
          <button
            onClick={handleAction}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-3 group/btn transition-colors"
          >
            Open Formatter
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        <button
          onClick={handleDismiss}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors absolute top-3 right-3"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
