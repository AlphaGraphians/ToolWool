'use client';
import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Download, RefreshCw, Move } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
export function ImageResizer({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, originalWidth: 0, originalHeight: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* Labels not in core t — derived from language signal */
  const widthLabel      = t.catUnit === 'Unit'    ? 'Width (px)'    : t.catUnit === 'اکائی' ? 'چوڑائی (px)' : t.catUnit === 'وحدة' ? 'العرض (px)' : t.catUnit === '单位' ? '宽度 (px)' : t.catUnit === 'Unité' ? 'Largeur (px)' : t.catUnit === 'Einheit' ? 'Breite (px)' : t.catUnit === 'Unidad' ? 'Ancho (px)' : t.catUnit === 'इकाई' ? 'चौड़ाई (px)' : t.catUnit === 'Unidade' ? 'Largura (px)' : t.catUnit === '単位' ? '幅 (px)' : t.catUnit === '단위' ? '너비 (px)' : 'Width (px)';
  const heightLabel     = t.catUnit === 'Unit'    ? 'Height (px)'   : t.catUnit === 'اکائی' ? 'اونچائی (px)' : t.catUnit === 'وحدة' ? 'الارتفاع (px)' : t.catUnit === '单位' ? '高度 (px)' : t.catUnit === 'Unité' ? 'Hauteur (px)' : t.catUnit === 'Einheit' ? 'Höhe (px)' : t.catUnit === 'Unidad' ? 'Alto (px)' : t.catUnit === 'इकाई' ? 'ऊंचाई (px)' : t.catUnit === 'Unidade' ? 'Altura (px)' : t.catUnit === '単位' ? '高さ (px)' : t.catUnit === '단위' ? '높이 (px)' : 'Height (px)';
  const originalLabel   = t.catUnit === 'Unit'    ? 'Original'      : t.catUnit === 'اکائی' ? 'اصل'         : t.catUnit === 'وحدة' ? 'الأصلي'        : t.catUnit === '单位' ? '原始'     : t.catUnit === 'Unité' ? 'Original'    : t.catUnit === 'Einheit' ? 'Original'   : t.catUnit === 'Unidad' ? 'Original'   : t.catUnit === 'इकाई' ? 'मूल'        : t.catUnit === 'Unidade' ? 'Original'   : t.catUnit === '単位' ? '元のサイズ' : t.catUnit === '단위' ? '원본'       : 'Original';
  const dropLabel       = t.dragDrop;
  const downloadLabel   = t.catUnit === 'Unit'    ? 'Download Resized Image' : t.catUnit === 'اکائی' ? 'تصویر ڈاؤن لوڈ کریں' : t.catUnit === 'وحدة' ? 'تحميل الصورة المعدلة' : t.catUnit === '单位' ? '下载调整后的图像' : t.catUnit === 'Unité' ? 'Télécharger l\'image redimensionnée' : t.catUnit === 'Einheit' ? 'Bild herunterladen' : t.catUnit === 'Unidad' ? 'Descargar imagen redimensionada' : t.catUnit === 'इकाई' ? 'रीसाइज़ की गई छवि डाउनलोड करें' : t.catUnit === 'Unidade' ? 'Baixar imagem redimensionada' : t.catUnit === '単位' ? 'リサイズした画像をダウンロード' : t.catUnit === '단위' ? '크기 조정된 이미지 다운로드' : 'Download Resized Image';
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
            originalHeight: img.height,
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
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(74,138,66,0.1)', color: 'var(--accent)' }}>
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{t.toolImageResizer}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-[var(--gold)]">
                Professional Processing
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* ── Body ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload & Preview */}
          <div className="flex flex-col gap-6">
            {!selectedImage ? (
              <label className="flex-1 min-h-[300px] border-2 border-dashed border-[var(--border)] rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <div className="p-5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">
                  <Move className="w-8 h-8" />
                </div>
                <p className="font-bold opacity-60">{dropLabel}</p>
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
                {/* Width */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-40">
                    {widthLabel}
                  </label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: parseInt(e.target.value) })}
                    className="w-full glass p-4 rounded-2xl outline-none focus:border-[var(--gold)]"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  />
                </div>
                {/* Height */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-40">
                    {heightLabel}
                  </label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) })}
                    className="w-full glass p-4 rounded-2xl outline-none focus:border-[var(--gold)]"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>
              {/* Original size info */}
              <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--gold)]/5">
                <p className="text-xs font-medium opacity-60 leading-relaxed italic">
                  {originalLabel}: {dimensions.originalWidth} × {dimensions.originalHeight} px
                </p>
              </div>
            </div>
            {/* Download button */}
            <button
              disabled={!selectedImage}
              onClick={handleDownload}
              className="w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-20"
              style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}
            >
              <Download className="w-5 h-5" /> {downloadLabel}
            </button>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
