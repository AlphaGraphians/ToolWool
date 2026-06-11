'use client';
import React, { useState, useRef } from 'react';
import { Sparkles, Upload, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
export function AiUpscaler({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // ── Language signal: t.catUnit (confirmed unique values from UnitConverter sample)
  // EN='Unit' | UR='اکائی' | AR='وحدة' | ZH='单位' | FR='Unité' | DE='Einheit'
  // ES='Unidad' | HI='इकाई' | PT='Unidade' | RU='Единица' | JA='単位' | KO='단위'
  const toolTitle =
    t.catUnit === 'Unit'     ? 'AI Sharpener Engine'                    :
    t.catUnit === 'اکائی'    ? 'اے آئی شارپنر انجن'                    :
    t.catUnit === 'وحدة'     ? 'محرك التحسين بالذكاء الاصطناعي'         :
    t.catUnit === '单位'     ? 'AI 画质增强引擎'                          :
    t.catUnit === 'Unité'    ? 'Moteur IA d\'amélioration'               :
    t.catUnit === 'Einheit'  ? 'KI-Schärfungs-Engine'                   :
    t.catUnit === 'Unidad'   ? 'Motor IA de Mejora'                     :
    t.catUnit === 'इकाई'     ? 'AI शार्पनर इंजन'                        :
    t.catUnit === 'Unidade'  ? 'Motor IA de Melhoria'                   :
    t.catUnit === 'Единица'  ? 'ИИ-движок улучшения'                    :
    t.catUnit === '単位'     ? 'AI シャープナーエンジン'                   :
    t.catUnit === '단위'     ? 'AI 선명도 향상 엔진'                      :
    'AI Sharpener Engine';
  const subtitleLabel =
    t.catUnit === 'Unit'     ? 'Professional Processing'                :
    t.catUnit === 'اکائی'    ? 'پروفیشنل پروسیسنگ'                     :
    t.catUnit === 'وحدة'     ? 'معالجة احترافية'                        :
    t.catUnit === '单位'     ? '专业处理'                                 :
    t.catUnit === 'Unité'    ? 'Traitement professionnel'               :
    t.catUnit === 'Einheit'  ? 'Professionelle Verarbeitung'            :
    t.catUnit === 'Unidad'   ? 'Procesamiento profesional'              :
    t.catUnit === 'इकाई'     ? 'व्यावसायिक प्रसंस्करण'                  :
    t.catUnit === 'Unidade'  ? 'Processamento profissional'             :
    t.catUnit === 'Единица'  ? 'Профессиональная обработка'             :
    t.catUnit === '単位'     ? 'プロフェッショナル処理'                    :
    t.catUnit === '단위'     ? '전문 처리'                                :
    'Professional Processing';
  const uploadLabel =
    t.catUnit === 'Unit'     ? 'Upload Image'                          :
    t.catUnit === 'اکائی'    ? 'تصویر اپلوڈ کریں'                      :
    t.catUnit === 'وحدة'     ? 'رفع الصورة'                            :
    t.catUnit === '单位'     ? '上传图片'                                :
    t.catUnit === 'Unité'    ? 'Télécharger l\'image'                  :
    t.catUnit === 'Einheit'  ? 'Bild hochladen'                        :
    t.catUnit === 'Unidad'   ? 'Subir imagen'                          :
    t.catUnit === 'इकाई'     ? 'छवि अपलोड करें'                        :
    t.catUnit === 'Unidade'  ? 'Enviar imagem'                         :
    t.catUnit === 'Единица'  ? 'Загрузить изображение'                 :
    t.catUnit === '単位'     ? '画像をアップロード'                       :
    t.catUnit === '단위'     ? '이미지 업로드'                           :
    'Upload Image';
  const processLabel =
    t.catUnit === 'Unit'     ? 'Process & Enhance'                     :
    t.catUnit === 'اکائی'    ? 'پروسیس اور بہتر بنائیں'                :
    t.catUnit === 'وحدة'     ? 'معالجة وتحسين'                         :
    t.catUnit === '单位'     ? '处理并增强'                              :
    t.catUnit === 'Unité'    ? 'Traiter et améliorer'                  :
    t.catUnit === 'Einheit'  ? 'Verarbeiten & Verbessern'              :
    t.catUnit === 'Unidad'   ? 'Procesar y mejorar'                    :
    t.catUnit === 'इकाई'     ? 'प्रोसेस करें और बेहतर बनाएँ'           :
    t.catUnit === 'Unidade'  ? 'Processar e melhorar'                  :
    t.catUnit === 'Единица'  ? 'Обработать и улучшить'                 :
    t.catUnit === '単位'     ? '処理して強化する'                         :
    t.catUnit === '단위'     ? '처리 및 향상'                            :
    'Process & Enhance';
  const processingLabel =
    t.catUnit === 'Unit'     ? 'Enhancing...'                          :
    t.catUnit === 'اکائی'    ? 'بہتر بنایا جا رہا ہے...'               :
    t.catUnit === 'وحدة'     ? 'جارٍ التحسين...'                       :
    t.catUnit === '单位'     ? '正在增强...'                             :
    t.catUnit === 'Unité'    ? 'Amélioration en cours...'              :
    t.catUnit === 'Einheit'  ? 'Wird verbessert...'                    :
    t.catUnit === 'Unidad'   ? 'Mejorando...'                          :
    t.catUnit === 'इकाई'     ? 'बेहतर बना रहे हैं...'                  :
    t.catUnit === 'Unidade'  ? 'Melhorando...'                         :
    t.catUnit === 'Единица'  ? 'Улучшение...'                          :
    t.catUnit === '単位'     ? '強化中...'                               :
    t.catUnit === '단위'     ? '향상 중...'                              :
    'Enhancing...';
  // ── Core logic ────────────────────────────────────────────────────────────
  const processWithAI = async () => {
    if (!imgRef.current) return;
    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx && imgRef.current) {
      // 4x Upscaling (Professional grade)
      canvas.width = imgRef.current.naturalWidth * 4;
      canvas.height = imgRef.current.naturalHeight * 4;
      // Deep Smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // Drawing - Bicubic algorithm equivalent
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      // AI-Like Sharpening
      ctx.filter = 'contrast(1.15) saturate(1.1) brightness(1.02)';
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(canvas, 0, 0);
      // Final output
      const link = document.createElement('a');
      link.download = `toolwool-enhanced-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
    setIsProcessing(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col">
        {/* ── Header ───────────────────────────────────────────── */}
        <div
          className="px-8 py-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-2xl"
              style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{toolTitle}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-[var(--gold)]">
                {subtitleLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="p-8">
          {!image ? (
            <label className="block h-64 border-2 border-dashed border-[var(--border)] rounded-2xl cursor-pointer flex items-center justify-center hover:bg-white/5 transition-all">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <span className="flex items-center gap-3 font-bold opacity-60">
                <Upload className="w-5 h-5" /> {uploadLabel}
              </span>
            </label>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
                <img
                  ref={imgRef}
                  src={image}
                  alt="Preview"
                  className="w-full h-auto"
                />
              </div>
              <button
                onClick={processWithAI}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}
              >
                <Sparkles className="w-5 h-5" />
                {isProcessing ? processingLabel : processLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}