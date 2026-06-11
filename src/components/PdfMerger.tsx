'use client';
import React, { useState } from 'react';
import { X, Files, Download, Trash2, Loader2, FilePlus } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useLanguage } from '@/context/LanguageContext';
export function PdfMerger({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState<string | null>(null);
  /* Derived labels */
  const addFilesLabel  = t.catPDF === 'PDF' ? 'Add PDF Files'   : t.catPDF === 'پی ڈی ایف' ? 'PDF فائلیں شامل کریں' : t.catPDF === 'PDF' ? 'إضافة ملفات PDF' : t.catPDF === 'PDF' ? '添加 PDF 文件' : 'Add PDF Files';
  const mergeBtnLabel  = t.catPDF === 'PDF' ? 'Merge PDFs'      : t.catPDF === 'پی ڈی ایف' ? 'PDF ملائیں'           : t.catPDF === 'PDF' ? 'دمج PDFs'          : t.catPDF === 'PDF' ? '合并 PDF'       : t.merge;
  const combineLabel   = t.catPDF === 'PDF' ? 'Combine Files'   : t.catPDF === 'پی ڈی ایف' ? 'فائلیں یکجا کریں'    : t.catPDF === 'PDF' ? 'دمج الملفات'       : t.catPDF === 'PDF' ? '合并文件'       : 'Combine Files';
  const errorLabel     = t.catPDF === 'PDF' ? 'Failed to merge PDFs. Please check your files.' : t.catPDF === 'پی ڈی ایف' ? 'PDF ملانے میں خرابی ہوئی۔' : t.catPDF === 'PDF' ? 'فشل في دمج ملفات PDF.' : t.catPDF === 'PDF' ? 'PDF 合并失败。' : 'Failed to merge PDFs.';
  /* For all 12 languages properly */
  const getAddLabel = () => {
    const s = t.catPDF;
    if (s === 'PDF')           return 'Add PDF Files';
    if (s === 'پی ڈی ایف')    return 'PDF فائلیں شامل کریں';
    if (s === 'PDF' && t.catText === 'نص') return 'إضافة ملفات PDF';
    if (s === 'PDF' && t.catText === '文本') return '添加 PDF 文件';
    if (s === 'PDF' && t.catText === 'Texte') return 'Ajouter des fichiers PDF';
    if (s === 'PDF' && t.catText === 'Text' && t.catUnit === 'Einheit') return 'PDF-Dateien hinzufügen';
    if (s === 'PDF' && t.catText === 'Texto' && t.catUnit === 'Unidad') return 'Agregar archivos PDF';
    if (s === 'PDF' && t.catText === 'पाठ') return 'PDF फ़ाइलें जोड़ें';
    if (s === 'PDF' && t.catText === 'Texto' && t.catUnit === 'Unidade') return 'Adicionar arquivos PDF';
    if (s === 'PDF' && t.catText === 'Текст') return 'Добавить PDF файлы';
    if (s === 'PDF' && t.catText === 'テキスト') return 'PDFファイルを追加';
    if (s === 'PDF' && t.catText === '텍스트') return 'PDF 파일 추가';
    return 'Add PDF Files';
  };
  const getMergeLabel = () => {
    const s = t.catText;
    if (s === 'Text' && t.catUnit === 'Unit')     return 'Merge PDFs';
    if (s === 'متن')   return 'PDF ملائیں';
    if (s === 'نص')    return 'دمج PDFs';
    if (s === '文本')   return '合并 PDF';
    if (s === 'Texte') return 'Fusionner les PDFs';
    if (s === 'Text' && t.catUnit === 'Einheit')  return 'PDFs zusammenführen';
    if (s === 'Texto' && t.catUnit === 'Unidad')  return 'Fusionar PDFs';
    if (s === 'पाठ')   return 'PDF मर्ज करें';
    if (s === 'Texto' && t.catUnit === 'Unidade') return 'Mesclar PDFs';
    if (s === 'Текст') return 'Объединить PDF';
    if (s === 'テキスト') return 'PDFを結合';
    if (s === '텍스트') return 'PDF 병합';
    return 'Merge PDFs';
  };
  const getMergingLabel = () => {
    const s = t.catText;
    if (s === 'Text' && t.catUnit === 'Unit')     return 'Merging…';
    if (s === 'متن')   return 'ملا رہا ہے…';
    if (s === 'نص')    return 'جاري الدمج…';
    if (s === '文本')   return '合并中…';
    if (s === 'Texte') return 'Fusion…';
    if (s === 'Text' && t.catUnit === 'Einheit')  return 'Zusammenführen…';
    if (s === 'Texto' && t.catUnit === 'Unidad')  return 'Fusionando…';
    if (s === 'पाठ')   return 'मर्ज हो रहा है…';
    if (s === 'Texto' && t.catUnit === 'Unidade') return 'Mesclando…';
    if (s === 'Текст') return 'Объединяю…';
    if (s === 'テキスト') return '結合中…';
    if (s === '텍스트') return '병합 중…';
    return 'Merging…';
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
      setMergeError(null);
    }
  };
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setMergeError(null);
  };
  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);
    setMergeError(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ToolWool_Merged.pdf';
      link.click();
    } catch {
      setMergeError(errorLabel);
    } finally {
      setIsMerging(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col max-h-[90vh]">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(45,90,39,0.1)', color: 'var(--accent)' }}>
              <Files className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{t.toolPdfMerger}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold" style={{ color: 'var(--gold)' }}>
                {combineLabel}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* ── Body ───────────────────────────────────────────── */}
        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Drop zone */}
          <div className="relative group">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-3 transition-all"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <FilePlus className="w-10 h-10 opacity-40" />
              <p className="text-sm font-bold opacity-60">{getAddLabel()}</p>
              <p className="text-xs opacity-40">{t.dragDrop}</p>
            </div>
          </div>
          {/* Error state */}
          {mergeError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              ⚠️ {mergeError}
            </div>
          )}
          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <span className="text-sm font-medium truncate max-w-[80%]">{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-red-600 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="px-8 py-5 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={mergePdfs}
            disabled={files.length < 2 || isMerging}
            className="flex items-center gap-3 px-8 py-3 rounded-2xl font-bold text-white transition-all disabled:opacity-30"
            style={{ background: 'var(--accent)' }}
          >
            {isMerging
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Download className="w-5 h-5" />
            }
            {isMerging ? getMergingLabel() : getMergeLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}