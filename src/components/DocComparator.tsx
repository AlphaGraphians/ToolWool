'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSearch, X, Split,
  ArrowRightLeft, Trash2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DocComparatorProps {
  onClose: () => void;
}

export default function DocComparator({ onClose }: DocComparatorProps) {
  const { t } = useLanguage();

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diffResult, setDiffResult] = useState<{ type: 'added' | 'removed' | 'same', value: string }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // ── Derived labels (not in core t) — language signal: t.catText ──────────

  const toolTitle =
    t.catText === 'Text'     ? 'Text Integrity Engine'    :
    t.catText === 'متن'      ? 'ٹیکسٹ انٹیگریٹی انجن'    :
    t.catText === 'نص'       ? 'محرك سلامة النص'           :
    t.catText === '文本'     ? '文本完整性引擎'              :
    t.catText === 'Texte'    ? 'Moteur d\'intégrité'       :
    t.catText === 'Text'     ? 'Text-Integritäts-Engine'  :
    t.catText === 'Texto'    ? 'Motor de Integridad'       :
    t.catText === 'टेक्स्ट' ? 'टेक्स्ट इंटीग्रिटी इंजन' :
    t.catText === 'Texto'    ? 'Motor de Integridade'      :
    t.catText === 'Текст'    ? 'Движок целостности текста' :
    t.catText === 'テキスト' ? 'テキスト整合性エンジン'      :
    t.catText === '텍스트'   ? '텍스트 무결성 엔진'          :
    'Text Integrity Engine';

  const labelSourceDoc =
    t.catText === 'Text'  ? 'Source Document (A)'      :
    t.catText === 'متن'   ? 'ماخذ دستاویز (A)'          :
    t.catText === 'نص'    ? 'المستند المصدر (A)'         :
    t.catText === '文本'  ? '源文档 (A)'                 :
    t.catText === 'Texte' ? 'Document source (A)'       :
    t.catText === 'Text'  ? 'Quelldokument (A)'         :
    t.catText === 'Texto' ? 'Documento fuente (A)'      :
    t.catText === 'टेक्स्ट' ? 'स्रोत दस्तावेज़ (A)'    :
    t.catText === 'Texto' ? 'Documento fonte (A)'       :
    t.catText === 'Текст' ? 'Исходный документ (A)'     :
    t.catText === 'テキスト' ? 'ソース文書 (A)'           :
    t.catText === '텍스트' ? '원본 문서 (A)'              :
    'Source Document (A)';

  const labelTargetDoc =
    t.catText === 'Text'  ? 'Target Document (B)'       :
    t.catText === 'متن'   ? 'ہدف دستاویز (B)'            :
    t.catText === 'نص'    ? 'المستند الهدف (B)'          :
    t.catText === '文本'  ? '目标文档 (B)'                :
    t.catText === 'Texte' ? 'Document cible (B)'        :
    t.catText === 'Text'  ? 'Zieldokument (B)'          :
    t.catText === 'Texto' ? 'Documento destino (B)'     :
    t.catText === 'टेक्स्ट' ? 'लक्ष्य दस्तावेज़ (B)'   :
    t.catText === 'Texto' ? 'Documento alvo (B)'        :
    t.catText === 'Текст' ? 'Целевой документ (B)'      :
    t.catText === 'テキスト' ? 'ターゲット文書 (B)'        :
    t.catText === '텍스트' ? '대상 문서 (B)'              :
    'Target Document (B)';

  const placeholderA =
    t.catText === 'Text'  ? 'Paste original text here...'      :
    t.catText === 'متن'   ? 'اصل متن یہاں پیسٹ کریں...'        :
    t.catText === 'نص'    ? 'الصق النص الأصلي هنا...'           :
    t.catText === '文本'  ? '在此粘贴原始文本...'                :
    t.catText === 'Texte' ? 'Collez le texte original ici...'  :
    t.catText === 'Text'  ? 'Originaltext hier einfügen...'    :
    t.catText === 'Texto' ? 'Pega el texto original aquí...'   :
    t.catText === 'टेक्स्ट' ? 'यहाँ मूल टेक्स्ट पेस्ट करें...' :
    t.catText === 'Texto' ? 'Cole o texto original aqui...'    :
    t.catText === 'Текст' ? 'Вставьте исходный текст сюда...'  :
    t.catText === 'テキスト' ? '元のテキストをここに貼り付け...'  :
    t.catText === '텍스트' ? '원본 텍스트를 여기에 붙여넣기...'  :
    'Paste original text here...';

  const placeholderB =
    t.catText === 'Text'  ? 'Paste modified text here...'      :
    t.catText === 'متن'   ? 'ترمیم شدہ متن یہاں پیسٹ کریں...'  :
    t.catText === 'نص'    ? 'الصق النص المعدّل هنا...'          :
    t.catText === '文本'  ? '在此粘贴修改后的文本...'            :
    t.catText === 'Texte' ? 'Collez le texte modifié ici...'  :
    t.catText === 'Text'  ? 'Geänderten Text hier einfügen...' :
    t.catText === 'Texto' ? 'Pega el texto modificado aquí...' :
    t.catText === 'टेक्स्ट' ? 'यहाँ संशोधित टेक्स्ट पेस्ट करें...' :
    t.catText === 'Texto' ? 'Cole o texto modificado aqui...'  :
    t.catText === 'Текст' ? 'Вставьте изменённый текст сюда...' :
    t.catText === 'テキスト' ? '変更済みテキストをここに貼り付け...' :
    t.catText === '텍스트' ? '수정된 텍스트를 여기에 붙여넣기...' :
    'Paste modified text here...';

  const labelRunCheck =
    t.catText === 'Text'  ? 'Run Integrity Check'        :
    t.catText === 'متن'   ? 'موازنہ چلائیں'               :
    t.catText === 'نص'    ? 'تشغيل فحص التكامل'           :
    t.catText === '文本'  ? '运行完整性检查'               :
    t.catText === 'Texte' ? 'Lancer la vérification'     :
    t.catText === 'Text'  ? 'Integritätsprüfung starten' :
    t.catText === 'Texto' ? 'Ejecutar verificación'      :
    t.catText === 'टेक्स्ट' ? 'जाँच चलाएँ'              :
    t.catText === 'Texto' ? 'Executar verificação'       :
    t.catText === 'Текст' ? 'Запустить проверку'         :
    t.catText === 'テキスト' ? '整合性チェック実行'          :
    t.catText === '텍스트' ? '무결성 검사 실행'             :
    'Run Integrity Check';

  const labelAnalysisResult =
    t.catText === 'Text'  ? 'Analysis Result'       :
    t.catText === 'متن'   ? 'تجزیہ کا نتیجہ'         :
    t.catText === 'نص'    ? 'نتيجة التحليل'          :
    t.catText === '文本'  ? '分析结果'                :
    t.catText === 'Texte' ? 'Résultat d\'analyse'    :
    t.catText === 'Text'  ? 'Analyseergebnis'        :
    t.catText === 'Texto' ? 'Resultado del análisis' :
    t.catText === 'टेक्स्ट' ? 'विश्लेषण परिणाम'    :
    t.catText === 'Texto' ? 'Resultado da análise'   :
    t.catText === 'Текст' ? 'Результат анализа'      :
    t.catText === 'テキスト' ? '分析結果'              :
    t.catText === '텍스트' ? '분석 결과'              :
    'Analysis Result';

  const labelNoAnalysis =
    t.catText === 'Text'  ? 'No analysis performed yet. Run check to see differences...'          :
    t.catText === 'متن'   ? 'ابھی تک کوئی تجزیہ نہیں ہوا۔ فرق دیکھنے کے لیے چیک چلائیں...'      :
    t.catText === 'نص'    ? 'لم يتم إجراء أي تحليل بعد. شغّل الفحص لرؤية الاختلافات...'          :
    t.catText === '文本'  ? '尚未执行分析。运行检查以查看差异...'                                    :
    t.catText === 'Texte' ? 'Aucune analyse effectuée. Lancez la vérification pour voir les différences...' :
    t.catText === 'Text'  ? 'Noch keine Analyse. Starten Sie die Prüfung, um Unterschiede zu sehen...' :
    t.catText === 'Texto' ? 'Aún no se ha realizado ningún análisis. Ejecuta la verificación...'  :
    t.catText === 'टेक्स्ट' ? 'अभी तक कोई विश्लेषण नहीं हुआ। अंतर देखने के लिए जाँच चलाएँ...' :
    t.catText === 'Texto' ? 'Nenhuma análise realizada ainda. Execute a verificação para ver as diferenças...' :
    t.catText === 'Текст' ? 'Анализ ещё не выполнен. Запустите проверку, чтобы увидеть различия...' :
    t.catText === 'テキスト' ? 'まだ分析されていません。チェックを実行して差分を確認してください...' :
    t.catText === '텍스트' ? '아직 분석이 수행되지 않았습니다. 검사를 실행하여 차이점을 확인하세요...' :
    'No analysis performed yet. Run check to see differences...';

  const toastBothPanels =
    t.catText === 'Text'  ? 'Please provide content in both panels'        :
    t.catText === 'متن'   ? 'براہ کرم دونوں پینلز میں مواد فراہم کریں'     :
    t.catText === 'نص'    ? 'يرجى تقديم محتوى في كلا اللوحتين'             :
    t.catText === '文本'  ? '请在两个面板中提供内容'                          :
    t.catText === 'Texte' ? 'Veuillez fournir du contenu dans les deux panneaux' :
    t.catText === 'Text'  ? 'Bitte in beiden Bereichen Inhalt angeben'     :
    t.catText === 'Texto' ? 'Por favor, proporciona contenido en ambos paneles' :
    t.catText === 'टेक्स्ट' ? 'कृपया दोनों पैनल में सामग्री प्रदान करें' :
    t.catText === 'Texto' ? 'Por favor, forneça conteúdo em ambos os painéis' :
    t.catText === 'Текст' ? 'Пожалуйста, заполните оба поля'               :
    t.catText === 'テキスト' ? '両方のパネルにコンテンツを入力してください' :
    t.catText === '텍스트' ? '두 패널 모두에 내용을 입력해 주세요'           :
    'Please provide content in both panels';

  const toastAnalysisComplete =
    t.catText === 'Text'  ? 'Analysis Complete'       :
    t.catText === 'متن'   ? 'تجزیہ مکمل ہو گیا'        :
    t.catText === 'نص'    ? 'اكتمل التحليل'            :
    t.catText === '文本'  ? '分析完成'                  :
    t.catText === 'Texte' ? 'Analyse terminée'         :
    t.catText === 'Text'  ? 'Analyse abgeschlossen'   :
    t.catText === 'Texto' ? 'Análisis completo'        :
    t.catText === 'टेक्स्ट' ? 'विश्लेषण पूर्ण'       :
    t.catText === 'Texto' ? 'Análise concluída'        :
    t.catText === 'Текст' ? 'Анализ завершён'          :
    t.catText === 'テキスト' ? '分析完了'               :
    t.catText === '텍스트' ? '분석 완료'               :
    'Analysis Complete';

  // ── Theme Sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setIsDarkMode(root.classList.contains('dark'));
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Diff Algorithm (Word-by-word) ─────────────────────────────────────────
  const runComparison = () => {
    if (!textA || !textB) {
      showToast(toastBothPanels);
      return;
    }

    const wordsA = textA.split(/(\s+)/);
    const wordsB = textB.split(/(\s+)/);

    const result: { type: 'added' | 'removed' | 'same'; value: string }[] = [];
    const maxLength = Math.max(wordsA.length, wordsB.length);

    for (let i = 0; i < maxLength; i++) {
      if (wordsA[i] === wordsB[i]) {
        result.push({ type: 'same', value: wordsA[i] });
      } else {
        if (wordsA[i]) result.push({ type: 'removed', value: wordsA[i] });
        if (wordsB[i]) result.push({ type: 'added', value: wordsB[i] });
      }
    }
    setDiffResult(result);
    showToast(toastAnalysisComplete);
  };

  const clearPanels = () => {
    setTextA('');
    setTextB('');
    setDiffResult([]);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans animate-in fade-in duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Toast Pill */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] bg-[#c5a059] text-black text-xs font-black px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-5">
          {toast}
        </div>
      )}

      <div className="relative w-full max-w-6xl bg-[#faf9f5] dark:bg-[#061a14] text-[#061a14] dark:text-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/40 dark:border-[#c5a059]/30 h-[90vh] flex flex-col transition-colors">

        {/* Header */}
        <div className="p-5 border-b border-[#c5a059]/20 flex justify-between items-center bg-black/[0.03] dark:bg-black/40">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-[#c5a059] rounded-lg">
              <FileSearch className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#c5a059] italic">
                {toolTitle}
              </h2>
              <p className="text-[9px] text-gray-500 dark:text-white/40 font-mono tracking-widest uppercase">
                Forensic Document Comparison Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearPanels}
              className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-full transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors border border-black/5 dark:border-white/5"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-white/60" />
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">

            {/* Panel A */}
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">
                {labelSourceDoc}
              </label>
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                placeholder={placeholderA}
                className="flex-1 bg-white dark:bg-black/40 border border-gray-200 dark:border-[#c5a059]/20 rounded-xl p-4 text-xs font-mono outline-none focus:border-[#c5a059] transition-all resize-none shadow-inner"
              />
            </div>

            {/* Panel B */}
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">
                {labelTargetDoc}
              </label>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder={placeholderB}
                className="flex-1 bg-white dark:bg-black/40 border border-gray-200 dark:border-[#c5a059]/20 rounded-xl p-4 text-xs font-mono outline-none focus:border-[#c5a059] transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-center">
            <button
              onClick={runComparison}
              className="px-12 py-4 bg-[#c5a059] text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#d4b16a] transition-all active:scale-[0.98] shadow-2xl flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" /> {labelRunCheck}
            </button>
          </div>

          {/* Diff Result Terminal */}
          <div className="h-48 bg-black/5 dark:bg-black/60 rounded-xl border border-[#c5a059]/10 p-4 overflow-y-auto custom-scroll text-left">
            <div className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Split className="w-3 h-3" /> {labelAnalysisResult}
            </div>
            {diffResult.length === 0 ? (
              <div className="text-[11px] text-gray-400 italic">
                {labelNoAnalysis}
              </div>
            ) : (
              <div className="text-[12px] font-mono leading-relaxed whitespace-pre-wrap">
                {diffResult.map((part, i) => (
                  <span
                    key={i}
                    className={`${
                      part.type === 'added'
                        ? 'bg-green-500/20 text-green-500 font-bold px-0.5'
                        : part.type === 'removed'
                        ? 'bg-rose-500/20 text-rose-500 line-through px-0.5'
                        : 'text-gray-500 dark:text-slate-300'
                    }`}
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}