"use client";
import React, { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { X, Upload, Download, Loader2, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
const BgRemover = ({ onClose }: { onClose: () => void }) => {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.7);
  const [processError, setProcessError] = useState('');
  /* Labels not in core t — t.close is unique per language (used as signal) */
  const titleLabel       = t.close === 'Close' ? 'AI Background Remover' : t.close === 'بند کریں' ? 'AI بیک گراؤنڈ ہٹانے والا' : t.close === 'إغلاق' ? 'إزالة الخلفية بالذكاء الاصطناعي' : t.close === '关闭' ? 'AI 背景移除' : t.close === 'Fermer' ? 'Suppresseur d\'arrière-plan IA' : t.close === 'Schließen' ? 'KI-Hintergrundentferner' : t.close === 'Cerrar' ? 'Eliminador de fondo IA' : t.close === 'बंद करें' ? 'AI पृष्ठभूमि हटाने वाला' : t.close === 'Fechar' ? 'Removedor de fundo IA' : t.close === 'Закрыть' ? 'AI удаление фона' : t.close === '閉じる' ? 'AI背景除去' : t.close === '닫기' ? 'AI 배경 제거' : 'AI Background Remover';
  const sensitivityLabel = t.close === 'Close' ? 'Sensitivity' : t.close === 'بند کریں' ? 'حساسیت' : t.close === 'إغلاق' ? 'الحساسية' : t.close === '关闭' ? '灵敏度' : t.close === 'Fermer' ? 'Sensibilité' : t.close === 'Schließen' ? 'Empfindlichkeit' : t.close === 'Cerrar' ? 'Sensibilidad' : t.close === 'बंद करें' ? 'संवेदनशीलता' : t.close === 'Fechar' ? 'Sensibilidade' : t.close === 'Закрыть' ? 'Чувствительность' : t.close === '閉じる' ? '感度' : t.close === '닫기' ? '민감도' : 'Sensitivity';
  const sensitivityHint  = t.close === 'Close' ? 'Lower value to preserve matching colors.' : t.close === 'بند کریں' ? 'ملتے رنگ محفوظ رکھنے کے لیے قدر کم کریں۔' : t.close === 'إغلاق' ? 'خفّض القيمة للحفاظ على الألوان المتطابقة.' : t.close === '关闭' ? '降低值以保留匹配颜色。' : t.close === 'Fermer' ? 'Réduisez la valeur pour préserver les couleurs.' : t.close === 'Schließen' ? 'Wert senken, um Farben zu erhalten.' : t.close === 'Cerrar' ? 'Baje el valor para preservar colores.' : t.close === 'बंद करें' ? 'मिलते रंग बचाने के लिए मान कम करें।' : t.close === 'Fechar' ? 'Reduza o valor para preservar cores.' : t.close === 'Закрыть' ? 'Уменьшите значение для сохранения цветов.' : t.close === '閉じる' ? '値を下げて色を保持してください。' : t.close === '닫기' ? '값을 낮춰 색상을 유지하세요.' : 'Lower value to preserve matching colors.';
  const uploadLabel      = t.close === 'Close' ? 'Click to Upload Image' : t.close === 'بند کریں' ? 'تصویر اپ لوڈ کریں' : t.close === 'إغلاق' ? 'انقر لرفع الصورة' : t.close === '关闭' ? '点击上传图片' : t.close === 'Fermer' ? 'Cliquez pour télécharger' : t.close === 'Schließen' ? 'Bild hochladen' : t.close === 'Cerrar' ? 'Clic para subir imagen' : t.close === 'बंद करें' ? 'छवि अपलोड करें' : t.close === 'Fechar' ? 'Clique para enviar imagem' : t.close === 'Закрыть' ? 'Нажмите для загрузки' : t.close === '閉じる' ? '画像をアップロード' : t.close === '닫기' ? '이미지 업로드' : 'Click to Upload Image';
  const processingLabel  = t.close === 'Close' ? 'AI is processing... Please wait...' : t.close === 'بند کریں' ? 'AI پروسیس کر رہا ہے... انتظار کریں...' : t.close === 'إغلاق' ? 'الذكاء الاصطناعي يعالج... يرجى الانتظار...' : t.close === '关闭' ? 'AI 处理中...请稍候...' : t.close === 'Fermer' ? 'Traitement IA en cours...' : t.close === 'Schließen' ? 'KI verarbeitet... Bitte warten...' : t.close === 'Cerrar' ? 'IA procesando... Espere...' : t.close === 'बंद करें' ? 'AI प्रक्रिया कर रहा है... प्रतीक्षा करें...' : t.close === 'Fechar' ? 'IA processando... Aguarde...' : t.close === 'Закрыть' ? 'ИИ обрабатывает... Подождите...' : t.close === '閉じる' ? 'AI処理中...お待ちください...' : t.close === '닫기' ? 'AI 처리 중... 기다려주세요...' : 'AI is processing... Please wait...';
  const newImageLabel    = t.close === 'Close' ? 'New Image' : t.close === 'بند کریں' ? 'نئی تصویر' : t.close === 'إغلاق' ? 'صورة جديدة' : t.close === '关闭' ? '新图片' : t.close === 'Fermer' ? 'Nouvelle image' : t.close === 'Schließen' ? 'Neues Bild' : t.close === 'Cerrar' ? 'Nueva imagen' : t.close === 'बंद करें' ? 'नई छवि' : t.close === 'Fechar' ? 'Nova imagem' : t.close === 'Закрыть' ? 'Новое изображение' : t.close === '閉じる' ? '新しい画像' : t.close === '닫기' ? '새 이미지' : 'New Image';
  const downloadLabel    = t.close === 'Close' ? 'Download PNG' : t.close === 'بند کریں' ? 'PNG ڈاؤن لوڈ کریں' : t.close === 'إغلاق' ? 'تحميل PNG' : t.close === '关闭' ? '下载 PNG' : t.close === 'Fermer' ? 'Télécharger PNG' : t.close === 'Schließen' ? 'PNG herunterladen' : t.close === 'Cerrar' ? 'Descargar PNG' : t.close === 'बंद करें' ? 'PNG डाउनलोड करें' : t.close === 'Fechar' ? 'Baixar PNG' : t.close === 'Закрыть' ? 'Скачать PNG' : t.close === '閉じる' ? 'PNGをダウンロード' : t.close === '닫기' ? 'PNG 다운로드' : 'Download PNG';
  const errorLabel       = t.close === 'Close' ? 'Processing failed. Please try again.' : t.close === 'بند کریں' ? 'پروسیسنگ میں مسئلہ آیا۔ دوبارہ کوشش کریں۔' : t.close === 'إغلاق' ? 'فشلت المعالجة. حاول مرة أخرى.' : t.close === '关闭' ? '处理失败，请重试。' : t.close === 'Fermer' ? 'Échec du traitement. Réessayez.' : t.close === 'Schließen' ? 'Verarbeitung fehlgeschlagen.' : t.close === 'Cerrar' ? 'Error de procesamiento. Intente de nuevo.' : t.close === 'बंद करें' ? 'प्रक्रिया विफल। पुनः प्रयास करें।' : t.close === 'Fechar' ? 'Falha no processamento. Tente novamente.' : t.close === 'Закрыть' ? 'Ошибка обработки. Попробуйте снова.' : t.close === '閉じる' ? '処理に失敗しました。再試行してください。' : t.close === '닫기' ? '처리 실패. 다시 시도하세요.' : 'Processing failed. Please try again.';
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setProcessError('');
    try {
      const blob = await removeBackground(file, {
        model: 'isnet_fp16',
      });
      const url = URL.createObjectURL(blob);
      setImage(url);
    } catch (error) {
      console.error("AI Error:", error);
      setProcessError(errorLabel);
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
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-[#1A3C34] dark:text-[#D4AF37]">{titleLabel}</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Tool Wool Standard Edition</p>
        </div>
        {/* ── Sensitivity Controller ──────────────────────────── */}
        {!image && !loading && (
          <div className="mb-6 px-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3" /> {sensitivityLabel}
              </span>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">{sensitivity.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0.01" max="1.0" step="0.01"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
            <p className="text-[9px] text-gray-400 mt-1 italic">{sensitivityHint}</p>
          </div>
        )}
        {/* ── Upload Zone ─────────────────────────────────────── */}
        {!loading && !image && (
          <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center hover:border-[#D4AF37] transition-colors relative">
            <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <Upload className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-500">{uploadLabel}</p>
          </div>
        )}
        {/* ── Error feedback — replaces alert() ───────────────── */}
        {processError && (
          <p className="text-sm text-red-500 font-medium text-center mt-4">{processError}</p>
        )}
        {/* ── Processing State ────────────────────────────────── */}
        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-[#D4AF37] font-bold animate-pulse text-sm">{processingLabel}</p>
          </div>
        )}
        {/* ── Result ─────────────────────────────────────────── */}
        {image && !loading && (
          <div className="text-center space-y-6">
            <div className="bg-checkered rounded-xl p-2 border inline-block shadow-inner">
              <img src={image} alt="Result" className="max-h-64 rounded-lg" />
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setImage(null); setProcessError(''); }}
                className="px-6 py-2 border dark:border-white/10 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-white/5"
              >
                {newImageLabel}
              </button>
              <a
                href={image}
                download="ToolWool_Result.png"
                className="px-10 py-2 bg-[#1A3C34] dark:bg-[#D4AF37] text-white rounded-xl font-bold shadow-lg hover:opacity-90 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> {downloadLabel}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BgRemover;