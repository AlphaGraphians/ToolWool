'use client';
import React, { useState, useEffect } from 'react';
import { X, Ruler, Copy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
type CatType = 'length' | 'weight' | 'temperature';
const UNITS: Record<CatType, { name: string; factor?: number; toBase?: (v: number) => number; fromBase?: (v: number) => number }[]> = {
  length: [
    { name: 'Meters (m)',      factor: 1       },
    { name: 'Kilometers (km)', factor: 0.001   },
    { name: 'Centimeters (cm)',factor: 100     },
    { name: 'Inches (in)',     factor: 39.3701 },
    { name: 'Feet (ft)',       factor: 3.28084 },
  ],
  weight: [
    { name: 'Kilograms (kg)', factor: 1       },
    { name: 'Grams (g)',      factor: 1000    },
    { name: 'Pounds (lbs)',   factor: 2.20462 },
    { name: 'Ounces (oz)',    factor: 35.274  },
  ],
  temperature: [
    { name: 'Celsius (°C)',    toBase: (v) => v,              fromBase: (v) => v             },
    { name: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
    { name: 'Kelvin (K)',      toBase: (v) => v - 273.15,     fromBase: (v) => v + 273.15    },
  ],
};
export function UnitConverter({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [cat, setCat] = useState<CatType>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit]     = useState<string>('');
  const [result, setResult]     = useState<number>(0);
  const [copyDone, setCopyDone] = useState(false);
  /* Tab labels — derived from language */
  const TAB_LABELS: Record<CatType, string> = {
    length:      t.catUnit === 'Unit' ? 'Length' : t.catUnit === 'اکائی' ? 'لمبائی' : t.catUnit === 'وحدة' ? 'الطول' : t.catUnit === '单位' ? '长度' : t.catUnit === 'Unité' ? 'Longueur' : t.catUnit === 'Einheit' ? 'Länge' : t.catUnit === 'Unidad' ? 'Longitud' : t.catUnit === 'इकाई' ? 'लंबाई' : t.catUnit === 'Unidade' ? 'Comprimento' : t.catUnit === 'Единица' ? 'Длина' : t.catUnit === '単位' ? '長さ' : t.catUnit === '단위' ? '길이' : 'Length',
    weight:      t.catUnit === 'Unit' ? 'Weight' : t.catUnit === 'اکائی' ? 'وزن'    : t.catUnit === 'وحدة' ? 'الوزن' : t.catUnit === '单位' ? '重量' : t.catUnit === 'Unité' ? 'Poids'    : t.catUnit === 'Einheit' ? 'Gewicht'  : t.catUnit === 'Unidad' ? 'Peso'      : t.catUnit === 'इकाई' ? 'वजन'    : t.catUnit === 'Unidade' ? 'Peso'         : t.catUnit === 'Единица' ? 'Вес'    : t.catUnit === '単位' ? '重さ' : t.catUnit === '단위' ? '무게' : 'Weight',
    temperature: t.catUnit === 'Unit' ? 'Temp'   : t.catUnit === 'اکائی' ? 'درجہ'   : t.catUnit === 'وحدة' ? 'الحرارة': t.catUnit === '单位' ? '温度' : t.catUnit === 'Unité' ? 'Temp.'    : t.catUnit === 'Einheit' ? 'Temp.'    : t.catUnit === 'Unidad' ? 'Temp.'     : t.catUnit === 'इकाई' ? 'तापमान' : t.catUnit === 'Unidade' ? 'Temp.'        : t.catUnit === 'Единица' ? 'Темп.' : t.catUnit === '単位' ? '温度' : t.catUnit === '단위' ? '온도' : 'Temp.',
  };
  const fromLabel   = t.catUnit === 'Unit' ? 'From' : t.catUnit === 'اکائی' ? 'سے'   : t.catUnit === 'وحدة' ? 'من'  : t.catUnit === '单位' ? '从' : t.catUnit === 'Unité' ? 'De'   : t.catUnit === 'Einheit' ? 'Von'  : t.catUnit === 'Unidad' ? 'De'   : t.catUnit === 'इकाई' ? 'से'  : t.catUnit === 'Unidade' ? 'De'  : t.catUnit === 'Единица' ? 'Из'     : t.catUnit === '単位' ? 'から' : t.catUnit === '단위' ? '에서' : 'From';
  const toLabel     = t.catUnit === 'Unit' ? 'To'   : t.catUnit === 'اکائی' ? 'تک'   : t.catUnit === 'وحدة' ? 'إلى': t.catUnit === '单位' ? '到' : t.catUnit === 'Unité' ? 'À'    : t.catUnit === 'Einheit' ? 'Nach' : t.catUnit === 'Unidad' ? 'A'    : t.catUnit === 'इकाई' ? 'तक' : t.catUnit === 'Unidade' ? 'Para': t.catUnit === 'Единица' ? 'В'      : t.catUnit === '単位' ? 'まで' : t.catUnit === '단위' ? '까지' : 'To';
  const copyResult  = t.catUnit === 'Unit' ? 'Copy Result' : t.catUnit === 'اکائی' ? 'نتیجہ کاپی کریں' : t.catUnit === 'وحدة' ? 'نسخ النتيجة' : t.catUnit === '单位' ? '复制结果' : t.catUnit === 'Unité' ? 'Copier le résultat' : t.catUnit === 'Einheit' ? 'Ergebnis kopieren' : t.catUnit === 'Unidad' ? 'Copiar resultado' : t.catUnit === 'इकाई' ? 'परिणाम कॉपी करें' : t.catUnit === 'Unidade' ? 'Copiar resultado' : t.catUnit === 'Единица' ? 'Скопировать' : t.catUnit === '単位' ? '結果をコピー' : t.catUnit === '단위' ? '결과 복사' : 'Copy Result';
  useEffect(() => {
    setFromUnit(UNITS[cat][0].name);
    setToUnit(UNITS[cat][1].name);
  }, [cat]);
  useEffect(() => {
    const val = parseFloat(value);
    if (isNaN(val)) { setResult(0); return; }
    const currentUnits = UNITS[cat];
    const from = currentUnits.find(u => u.name === fromUnit);
    const to   = currentUnits.find(u => u.name === toUnit);
    if (!from || !to) return;
    if (cat === 'temperature') {
      setResult(to.fromBase!(from.toBase!(val)));
    } else {
      setResult((val / from.factor!) * to.factor!);
    }
  }, [value, fromUnit, toUnit, cat]);
  const handleCopy = () => {
    navigator.clipboard.writeText(result.toString());
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1800);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(90,126,84,0.1)', color: '#5a7e54' }}>
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{t.toolUnitConverter}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-[var(--gold)]">
                Instant Conversion
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* ── Category Tabs ───────────────────────────────────── */}
        <div className="flex px-6 pt-4 gap-2 border-b border-white/5 bg-black/5">
          {(['length', 'weight', 'temperature'] as CatType[]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-t-xl text-[11px] font-black uppercase tracking-wider transition-all border-b-2 ${
                cat === c ? 'border-[var(--gold)] opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
              }`}
            >
              {TAB_LABELS[c]}
            </button>
          ))}
        </div>
        {/* ── Workspace ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* FROM */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider opacity-40">{fromLabel}</label>
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
          {/* TO */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider opacity-40">{toLabel}</label>
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
        {/* ── Footer ─────────────────────────────────────────── */}
        <div
          className="px-6 py-4 border-t flex justify-between items-center bg-black/5"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[var(--border)] hover:bg-white/5"
          >
            <Copy className="w-3.5 h-3.5" />
            {copyDone ? t.copied : copyResult}
          </button>
          <p className="text-[10px] font-medium opacity-40 italic">Precision client-side engine</p>
        </div>
      </div>
    </div>
  );
}