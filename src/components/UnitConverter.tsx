'use client';
import React, { useState, useEffect } from 'react';
import { X, Ruler, Copy } from 'lucide-react';

type CatType = 'length' | 'weight' | 'temperature';

const UNITS: Record<CatType, { name: string; factor?: number; toBase?: (v: number) => number; fromBase?: (v: number) => number }[]> = {
  length: [
    { name: 'Meters (m)', factor: 1 },
    { name: 'Kilometers (km)', factor: 0.001 },
    { name: 'Centimeters (cm)', factor: 100 },
    { name: 'Inches (in)', factor: 39.3701 },
    { name: 'Feet (ft)', factor: 3.28084 },
  ],
  weight: [
    { name: 'Kilograms (kg)', factor: 1 },
    { name: 'Grams (g)', factor: 1000 },
    { name: 'Pounds (lbs)', factor: 2.20462 },
    { name: 'Ounces (oz)', factor: 35.274 },
  ],
  temperature: [
    { name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
    { name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
};

export function UnitConverter({ onClose }: { onClose: () => void }) {
  const [cat, setCat] = useState<CatType>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    setFromUnit(UNITS[cat][0].name);
    setToUnit(UNITS[cat][1].name);
  }, [cat]);

  useEffect(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult(0);
      return;
    }

    const currentUnits = UNITS[cat];
    const from = currentUnits.find(u => u.name === fromUnit);
    const to = currentUnits.find(u => u.name === toUnit);

    if (!from || !to) return;

    if (cat === 'temperature') {
      const baseValue = from.toBase!(val);
      setResult(to.fromBase!(baseValue));
    } else {
      const baseValue = val / from.factor!;
      setResult(baseValue * to.factor!);
    }
  }, [value, fromUnit, toUnit, cat]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(90,126,84,0.1)', color: '#5a7e54' }}>
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Unit Converter</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-[var(--gold)]">Instant Conversion</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-5 h-5" /></button>
        </div>

        {/* Category Tabs */}
        <div className="flex px-6 pt-4 gap-2 border-b border-white/5 bg-black/5">
          {(['length', 'weight', 'temperature'] as CatType[]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-t-xl text-[11px] font-black uppercase tracking-wider transition-all border-b-2 ${
                cat === c ? 'border-[var(--gold)] opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Workspace - Fixed stacked layout to avoid overlapping */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          
          {/* FROM SECTION */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider opacity-40">From</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="sm:col-span-2 glass p-3.5 rounded-xl outline-none font-bold text-base"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="glass p-3.5 rounded-xl outline-none text-xs font-semibold bg-[var(--bg-secondary)]"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {UNITS[cat].map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
              </select>
            </div>
          </div>

          {/* TO SECTION */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider opacity-40">To</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                className="sm:col-span-2 glass p-3.5 rounded-xl font-black text-base flex items-center overflow-x-auto"
                style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid var(--border)', color: 'var(--gold)' }}
              >
                {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="glass p-3.5 rounded-xl outline-none text-xs font-semibold bg-[var(--bg-secondary)]"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {UNITS[cat].map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
              </select>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex justify-between items-center bg-black/5" style={{ borderColor: 'var(--border)' }}>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(result.toString());
              alert('Copied to clipboard!');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--border)] hover:bg-white/5"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Result
          </button>
          <p className="text-[10px] font-medium opacity-40 italic">Precision client-side engine</p>
        </div>
      </div>
    </div>
  );
}