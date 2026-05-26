'use client';
import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Download, RefreshCw, Move } from 'lucide-react';

export function ImageResizer({ onClose }: { onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, originalWidth: 0, originalHeight: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setSelectedImage(event.target?.result as string);
          setDimensions({
            width: img.width,
            height: img.height,
            originalWidth: img.width,
            originalHeight: img.height
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const img = new Image();
    img.onload = () => {
      if (canvas) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, dimensions.width, dimensions.height);
        const link = document.createElement('a');
        link.download = `toolwool-resized-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    img.src = selectedImage!;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(74,138,66,0.1)', color: 'var(--accent)' }}>
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Image Resizer</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-[var(--gold)]">Professional Processing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload & Preview */}
          <div className="flex flex-col gap-6">
            {!selectedImage ? (
              <label className="flex-1 min-h-[300px] border-2 border-dashed border-[var(--border)] rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div className="p-5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)]"><Move className="w-8 h-8" /></div>
                <p className="font-bold opacity-60">Drop image or click to upload</p>
              </label>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-black/20">
                <img src={selectedImage} alt="Preview" className="w-full h-auto" />
                <button 
                  onClick={() => setSelectedImage(null)} 
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-red-500 transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-8 justify-center">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-40">Width (px)</label>
                  <input 
                    type="number" 
                    value={dimensions.width}
                    onChange={(e) => setDimensions({...dimensions, width: parseInt(e.target.value)})}
                    className="w-full glass p-4 rounded-2xl outline-none focus:border-[var(--gold)]"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-40">Height (px)</label>
                  <input 
                    type="number" 
                    value={dimensions.height}
                    onChange={(e) => setDimensions({...dimensions, height: parseInt(e.target.value)})}
                    className="w-full glass p-4 rounded-2xl outline-none focus:border-[var(--gold)]"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--gold)]/5">
                <p className="text-xs font-medium opacity-60 leading-relaxed italic">
                  Original: {dimensions.originalWidth} x {dimensions.originalHeight} px
                </p>
              </div>
            </div>

            <button 
              disabled={!selectedImage}
              onClick={handleDownload}
              className="w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-20"
              style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}
            >
              <Download className="w-5 h-5" /> Download Resized Image
            </button>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}