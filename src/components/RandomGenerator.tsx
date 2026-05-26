'use client';
import React, { useState, useEffect } from 'react';
import { X, Shuffle, Copy, RefreshCw } from 'lucide-react';

export function RandomGenerator({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [uuid, setUuid] = useState('');
  const [hexColor, setHexColor] = useState('#C9A84C');

  const genPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let pass = '';
    for (let i = 0; i < 16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setPassword(pass);
  };

  const genUuid = () => {
    const newUuid = window.crypto.randomUUID ? window.crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setUuid(newUuid);
  };

  const genColor = () => {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    setHexColor(hex);
  };

  useEffect(() => {
    genPassword();
    genUuid();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>
              <Shuffle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Random Generator</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold" style={{ color: 'var(--gold)' }}>Security & Dev Tools</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Password Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Secure Password</label>
            <div className="flex gap-2">
              <div className="flex-1 p-4 rounded-2xl font-mono text-base border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                {password}
              </div>
              <button onClick={genPassword} className="p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all"><RefreshCw className="w-5 h-5" /></button>
              <button onClick={() => navigator.clipboard.writeText(password)} className="p-4 rounded-2xl transition-all" style={{ background: 'var(--gold)', color: 'white' }}><Copy className="w-5 h-5" /></button>
            </div>
          </div>

          {/* UUID Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">UUID v4</label>
            <div className="flex gap-2">
              <div className="flex-1 p-4 rounded-2xl font-mono text-sm border overflow-x-auto whitespace-nowrap" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                {uuid}
              </div>
              <button onClick={genUuid} className="p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all"><RefreshCw className="w-5 h-5" /></button>
              <button onClick={() => navigator.clipboard.writeText(uuid)} className="p-4 rounded-2xl transition-all" style={{ background: 'var(--gold)', color: 'white' }}><Copy className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Color Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Random Color</label>
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg shrink-0" style={{ backgroundColor: hexColor }} />
              <div className="flex-1 flex gap-2">
                <div className="flex-1 p-4 rounded-2xl font-mono text-lg font-bold border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                  {hexColor}
                </div>
                <button onClick={genColor} className="p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all"><RefreshCw className="w-5 h-5" /></button>
                <button onClick={() => navigator.clipboard.writeText(hexColor)} className="p-4 rounded-2xl transition-all" style={{ background: 'var(--gold)', color: 'white' }}><Copy className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}