'use client';
import React, { useState } from 'react';
import { X, Files, Download, Trash2, Loader2, FilePlus } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export function PdfMerger({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      // pdfBytes ko Uint8Array mein force karein taake TypeScript khush ho jaye
const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ToolWool_Merged.pdf';
      link.click();
    } catch (error) {
      alert("PDF merge karte waqt masla hua.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-[2rem] overflow-hidden modal-in flex flex-col max-h-[90vh]">
        <div className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(45,90,39,0.1)', color: 'var(--accent)' }}>
              <Files className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">PDF Merger</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold" style={{ color: 'var(--gold)' }}>Combine Files</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-all"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="relative group">
            <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-3 transition-all" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
              <FilePlus className="w-10 h-10 opacity-40" />
              <p className="text-sm font-bold opacity-60">Add PDF Files</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate max-w-[80%]">{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-5 border-t flex justify-end">
          <button onClick={mergePdfs} disabled={files.length < 2 || isMerging} className="flex items-center gap-3 px-8 py-3 rounded-2xl font-bold text-white transition-all disabled:opacity-30" style={{ background: 'var(--accent)' }}>
            {isMerging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isMerging ? 'Merging...' : 'Merge PDFs'}
          </button>
        </div>
      </div>
    </div>
  );
}