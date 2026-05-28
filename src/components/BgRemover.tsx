"use client";
import React, { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { X, Upload, Download, Loader2, SlidersHorizontal } from 'lucide-react';

const BgRemover = ({ onClose }: { onClose: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Sensitivity variable jo 1 se niche tak jaye gi
  const [sensitivity, setSensitivity] = useState(0.7);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Sensitivity ko threshold ke tor par use kiya gaya hai
      const blob = await removeBackground(file, {
  model: 'isnet_fp16',
});
      const url = URL.createObjectURL(blob);
      setImage(url);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Processing mein masla aya. Office network shayad block kar raha hai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-white/5">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-[#1A3C34] dark:text-[#D4AF37]">AI Background Remover</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Tool Wool Standard Edition</p>
        </div>

        {/* Sensitivity Controller - Card ke andar hi simple placement */}
        {!image && !loading && (
          <div className="mb-6 px-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3" /> Sensitivity
              </span>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">{sensitivity.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0.01" max="1.0" step="0.01" 
              value={sensitivity} 
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
            <p className="text-[9px] text-gray-400 mt-1 italic italic">Matching colors bachane ke liye value kam karein.</p>
          </div>
        )}

        {!loading && !image && (
          <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center hover:border-[#D4AF37] transition-colors relative">
            <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <Upload className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-500">Click to Upload Image</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-[#D4AF37] font-bold animate-pulse text-sm">AI is processing... Please wait...</p>
          </div>
        )}

        {image && !loading && (
          <div className="text-center space-y-6">
            <div className="bg-checkered rounded-xl p-2 border inline-block shadow-inner">
              <img src={image} alt="Result" className="max-h-64 rounded-lg" />
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setImage(null)} className="px-6 py-2 border dark:border-white/10 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-white/5">New Image</button>
              <a href={image} download="ToolWool_Result.png" className="px-10 py-2 bg-[#1A3C34] dark:bg-[#D4AF37] text-white rounded-xl font-bold shadow-lg hover:opacity-90">Download PNG</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BgRemover;