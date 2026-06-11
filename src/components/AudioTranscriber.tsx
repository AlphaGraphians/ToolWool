"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FileAudio, Upload, Play, Pause, RefreshCw, X, Languages, Volume2, Info, Loader2, ArrowLeft, ClipboardCheck, ChevronDown, ChevronUp, FastForward, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
interface AudioTranscriberProps {
  onClose: () => void;
}
const OFFENSIVE_WORDS_DATABASE = [
  "Shut up", "sh*t", "f*ck", "b*tch", "asshole", "dick", "pussy", "bastard", "sl*t", "whore",
  "kaminey", "saala", "kutta", "harami", "haramzada", "gandu", "chutiya", "bhosdike", "madarchod", "behenchod"
];
const AudioTranscriber: React.FC<AudioTranscriberProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [langMode, setLangMode] = useState<'en' | 'multilingual'>('en');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showFullResult, setShowFullResult] = useState<boolean>(false);
  const [qualityCheck, setQualityCheck] = useState<any[] | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // ── Language signal: t.catUnit (confirmed unique per language)
  // EN='Unit' | UR='اکائی' | AR='وحدة' | ZH='单位' | FR='Unité' | DE='Einheit'
  // ES='Unidad' | HI='इकाई' | PT='Unidade' | RU='Единица' | JA='単位' | KO='단위'
  const toolTitle =
    t.catUnit === 'Unit'    ? 'AI Audio Transcriber'             :
    t.catUnit === 'اکائی'   ? 'اے آئی آڈیو ٹرانسکرائبر'          :
    t.catUnit === 'وحدة'    ? 'محول الصوت بالذكاء الاصطناعي'     :
    t.catUnit === '单位'    ? 'AI 音频转录器'                      :
    t.catUnit === 'Unité'   ? 'Transcripteur Audio IA'           :
    t.catUnit === 'Einheit' ? 'KI Audio-Transkription'           :
    t.catUnit === 'Unidad'  ? 'Transcriptor de Audio IA'         :
    t.catUnit === 'इकाई'    ? 'AI ऑडियो ट्रांसक्राइबर'           :
    t.catUnit === 'Unidade' ? 'Transcritor de Áudio IA'          :
    t.catUnit === 'Единица' ? 'ИИ Транскрибатор Аудио'           :
    t.catUnit === '単位'    ? 'AI音声文字起こし'                   :
    t.catUnit === '단위'    ? 'AI 오디오 전사기'                   :
    'AI Audio Transcriber';
  const subtitleLabel =
    t.catUnit === 'Unit'    ? '100% Free Client-Side Neural Pipeline'        :
    t.catUnit === 'اکائی'   ? '100% مفت کلائنٹ سائیڈ نیورل پائپ لائن'       :
    t.catUnit === 'وحدة'    ? 'معالجة عصبية مجانية 100% على الجهاز'          :
    t.catUnit === '单位'    ? '100% 免费本地神经网络处理'                       :
    t.catUnit === 'Unité'   ? 'Pipeline neuronal 100% gratuit côté client'   :
    t.catUnit === 'Einheit' ? '100% kostenlose clientseitige KI-Pipeline'    :
    t.catUnit === 'Unidad'  ? 'Pipeline neuronal 100% gratuito en cliente'   :
    t.catUnit === 'इकाई'    ? '100% मुफ़्त क्लाइंट-साइड न्यूरल पाइपलाइन'   :
    t.catUnit === 'Unidade' ? 'Pipeline neural 100% gratuito no cliente'     :
    t.catUnit === 'Единица' ? '100% бесплатный нейронный конвейер'           :
    t.catUnit === '単位'    ? '100% 無料クライアントサイドニューラル処理'       :
    t.catUnit === '단위'    ? '100% 무료 클라이언트 측 신경망 파이프라인'      :
    '100% Free Client-Side Neural Pipeline';
  const engineTuningLabel =
    t.catUnit === 'Unit'    ? 'Engine Tuning'        :
    t.catUnit === 'اکائی'   ? 'انجن ٹیوننگ'           :
    t.catUnit === 'وحدة'    ? 'ضبط المحرك'            :
    t.catUnit === '单位'    ? '引擎调节'               :
    t.catUnit === 'Unité'   ? 'Réglage du moteur'    :
    t.catUnit === 'Einheit' ? 'Motor-Einstellung'    :
    t.catUnit === 'Unidad'  ? 'Ajuste del motor'     :
    t.catUnit === 'इकाई'    ? 'इंजन ट्यूनिंग'         :
    t.catUnit === 'Unidade' ? 'Ajuste do motor'      :
    t.catUnit === 'Единица' ? 'Настройка движка'     :
    t.catUnit === '単位'    ? 'エンジン調整'           :
    t.catUnit === '단위'    ? '엔진 튜닝'              :
    'Engine Tuning';
  const chooseFileLabel =
    t.catUnit === 'Unit'    ? 'Choose audio file'          :
    t.catUnit === 'اکائی'   ? 'آڈیو فائل منتخب کریں'        :
    t.catUnit === 'وحدة'    ? 'اختر ملف صوتي'               :
    t.catUnit === '单位'    ? '选择音频文件'                  :
    t.catUnit === 'Unité'   ? 'Choisir un fichier audio'   :
    t.catUnit === 'Einheit' ? 'Audiodatei auswählen'       :
    t.catUnit === 'Unidad'  ? 'Elegir archivo de audio'    :
    t.catUnit === 'इकाई'    ? 'ऑडियो फ़ाइल चुनें'           :
    t.catUnit === 'Unidade' ? 'Escolher arquivo de áudio'  :
    t.catUnit === 'Единица' ? 'Выбрать аудиофайл'          :
    t.catUnit === '単位'    ? '音声ファイルを選択'            :
    t.catUnit === '단위'    ? '오디오 파일 선택'             :
    'Choose audio file';
  const playLabel =
    t.catUnit === 'Unit'    ? 'Play'     :
    t.catUnit === 'اکائی'   ? 'چلائیں'   :
    t.catUnit === 'وحدة'    ? 'تشغيل'    :
    t.catUnit === '单位'    ? '播放'      :
    t.catUnit === 'Unité'   ? 'Lire'     :
    t.catUnit === 'Einheit' ? 'Abspielen':
    t.catUnit === 'Unidad'  ? 'Reproducir':
    t.catUnit === 'इकाई'    ? 'चलाएँ'    :
    t.catUnit === 'Unidade' ? 'Reproduzir':
    t.catUnit === 'Единица' ? 'Играть'   :
    t.catUnit === '単位'    ? '再生'      :
    t.catUnit === '단위'    ? '재생'      :
    'Play';
  const pauseLabel =
    t.catUnit === 'Unit'    ? 'Pause'    :
    t.catUnit === 'اکائی'   ? 'روکیں'    :
    t.catUnit === 'وحدة'    ? 'إيقاف'    :
    t.catUnit === '单位'    ? '暂停'      :
    t.catUnit === 'Unité'   ? 'Pause'    :
    t.catUnit === 'Einheit' ? 'Pausieren':
    t.catUnit === 'Unidad'  ? 'Pausar'   :
    t.catUnit === 'इकाई'    ? 'रोकें'    :
    t.catUnit === 'Unidade' ? 'Pausar'   :
    t.catUnit === 'Единица' ? 'Пауза'    :
    t.catUnit === '単位'    ? '一時停止'  :
    t.catUnit === '단위'    ? '일시정지'  :
    'Pause';
  const speedLabel =
    t.catUnit === 'Unit'    ? 'Speed Controller'      :
    t.catUnit === 'اکائی'   ? 'رفتار کنٹرول'           :
    t.catUnit === 'وحدة'    ? 'التحكم في السرعة'        :
    t.catUnit === '单位'    ? '速度控制'                :
    t.catUnit === 'Unité'   ? 'Contrôle vitesse'       :
    t.catUnit === 'Einheit' ? 'Geschwindigkeit'        :
    t.catUnit === 'Unidad'  ? 'Control de velocidad'   :
    t.catUnit === 'इकाई'    ? 'गति नियंत्रण'            :
    t.catUnit === 'Unidade' ? 'Controle de velocidade' :
    t.catUnit === 'Единица' ? 'Контроль скорости'      :
    t.catUnit === '単位'    ? '速度コントロール'          :
    t.catUnit === '단위'    ? '속도 조절'               :
    'Speed Controller';
  const transcribeLabel =
    t.catUnit === 'Unit'    ? 'Transcribe Locally'         :
    t.catUnit === 'اکائی'   ? 'لوکل ٹرانسکرائب کریں'       :
    t.catUnit === 'وحدة'    ? 'نسخ محلياً'                 :
    t.catUnit === '单位'    ? '本地转录'                     :
    t.catUnit === 'Unité'   ? 'Transcrire localement'      :
    t.catUnit === 'Einheit' ? 'Lokal transkribieren'       :
    t.catUnit === 'Unidad'  ? 'Transcribir localmente'     :
    t.catUnit === 'इकाई'    ? 'स्थानीय रूप से ट्रांसक्राइब':
    t.catUnit === 'Unidade' ? 'Transcrever localmente'     :
    t.catUnit === 'Единица' ? 'Транскрибировать локально'  :
    t.catUnit === '単位'    ? 'ローカルで文字起こし'          :
    t.catUnit === '단위'    ? '로컬로 전사하기'              :
    'Transcribe Locally';
  const processingLabel =
    t.catUnit === 'Unit'    ? 'Processing...'          :
    t.catUnit === 'اکائی'   ? 'پروسیسنگ جاری ہے...'    :
    t.catUnit === 'وحدة'    ? 'جارٍ المعالجة...'        :
    t.catUnit === '单位'    ? '处理中...'               :
    t.catUnit === 'Unité'   ? 'Traitement en cours...' :
    t.catUnit === 'Einheit' ? 'Verarbeitung...'        :
    t.catUnit === 'Unidad'  ? 'Procesando...'          :
    t.catUnit === 'इकाई'    ? 'प्रोसेसिंग...'           :
    t.catUnit === 'Unidade' ? 'Processando...'         :
    t.catUnit === 'Единица' ? 'Обработка...'           :
    t.catUnit === '単位'    ? '処理中...'               :
    t.catUnit === '단위'    ? '처리 중...'              :
    'Processing...';
  const resultLabel =
    t.catUnit === 'Unit'    ? 'Result Transcript'       :
    t.catUnit === 'اکائی'   ? 'نتیجہ ٹرانسکرپٹ'         :
    t.catUnit === 'وحدة'    ? 'نص النتيجة'               :
    t.catUnit === '单位'    ? '转录结果'                  :
    t.catUnit === 'Unité'   ? 'Transcription résultat'  :
    t.catUnit === 'Einheit' ? 'Ergebnis-Transkript'     :
    t.catUnit === 'Unidad'  ? 'Transcripción resultado' :
    t.catUnit === 'इकाई'    ? 'परिणाम ट्रांसक्रिप्ट'    :
    t.catUnit === 'Unidade' ? 'Transcrição resultado'   :
    t.catUnit === 'Единица' ? 'Результат транскрипции'  :
    t.catUnit === '単位'    ? '結果テキスト'              :
    t.catUnit === '단위'    ? '결과 전사'                :
    'Result Transcript';
  const noTranscriptionLabel =
    t.catUnit === 'Unit'    ? 'No transcription active'       :
    t.catUnit === 'اکائی'   ? 'کوئی ٹرانسکرپشن فعال نہیں'     :
    t.catUnit === 'وحدة'    ? 'لا يوجد نسخ نشط'               :
    t.catUnit === '单位'    ? '暂无转录'                        :
    t.catUnit === 'Unité'   ? 'Aucune transcription active'   :
    t.catUnit === 'Einheit' ? 'Keine Transkription aktiv'     :
    t.catUnit === 'Unidad'  ? 'Sin transcripción activa'      :
    t.catUnit === 'इकाई'    ? 'कोई ट्रांसक्रिप्शन सक्रिय नहीं':
    t.catUnit === 'Unidade' ? 'Nenhuma transcrição ativa'     :
    t.catUnit === 'Единица' ? 'Нет активной транскрипции'     :
    t.catUnit === '単位'    ? '文字起こしなし'                  :
    t.catUnit === '단위'    ? '전사 없음'                      :
    'No transcription active';
  const privacyLabel =
    t.catUnit === 'Unit'    ? 'Processed natively on device. Privacy guaranteed.'               :
    t.catUnit === 'اکائی'   ? 'ڈیوائس پر مقامی طور پر پروسیس ہوتا ہے۔ پرائیویسی یقینی ہے۔'   :
    t.catUnit === 'وحدة'    ? 'تتم المعالجة محلياً على الجهاز. الخصوصية مضمونة.'               :
    t.catUnit === '单位'    ? '在设备本地处理。隐私有保障。'                                       :
    t.catUnit === 'Unité'   ? 'Traité nativement sur l\'appareil. Confidentialité garantie.'   :
    t.catUnit === 'Einheit' ? 'Nativ auf dem Gerät verarbeitet. Datenschutz garantiert.'       :
    t.catUnit === 'Unidad'  ? 'Procesado de forma nativa en el dispositivo. Privacidad garantizada.' :
    t.catUnit === 'इकाई'    ? 'डिवाइस पर स्थानीय रूप से प्रोसेस किया गया। गोपनीयता की गारंटी।' :
    t.catUnit === 'Unidade' ? 'Processado nativamente no dispositivo. Privacidade garantida.'  :
    t.catUnit === 'Единица' ? 'Обрабатывается на устройстве. Конфиденциальность гарантирована.' :
    t.catUnit === '単位'    ? 'デバイス上でネイティブに処理。プライバシー保証。'                    :
    t.catUnit === '단위'    ? '기기에서 기본적으로 처리됩니다. 개인정보 보호 보장.'               :
    'Processed natively on device. Privacy guaranteed.';
  const auditLabel =
    t.catUnit === 'Unit'    ? 'Call Quality Audit'        :
    t.catUnit === 'اکائی'   ? 'کال کوالٹی آڈٹ'             :
    t.catUnit === 'وحدة'    ? 'تدقيق جودة المكالمة'        :
    t.catUnit === '单位'    ? '通话质量审计'                 :
    t.catUnit === 'Unité'   ? 'Audit qualité d\'appel'    :
    t.catUnit === 'Einheit' ? 'Anrufqualitäts-Audit'     :
    t.catUnit === 'Unidad'  ? 'Auditoría de calidad'      :
    t.catUnit === 'इकाई'    ? 'कॉल गुणवत्ता ऑडिट'         :
    t.catUnit === 'Unidade' ? 'Auditoria de qualidade'   :
    t.catUnit === 'Единица' ? 'Аудит качества звонка'    :
    t.catUnit === '単位'    ? '通話品質監査'               :
    t.catUnit === '단위'    ? '통화 품질 감사'             :
    'Call Quality Audit';
  const previewLabel =
    t.catUnit === 'Unit'    ? 'Preview'    :
    t.catUnit === 'اکائی'   ? 'پیش نظارہ'  :
    t.catUnit === 'وحدة'    ? 'معاينة'     :
    t.catUnit === '单位'    ? '预览'        :
    t.catUnit === 'Unité'   ? 'Aperçu'    :
    t.catUnit === 'Einheit' ? 'Vorschau'  :
    t.catUnit === 'Unidad'  ? 'Vista previa':
    t.catUnit === 'इकाई'    ? 'पूर्वावलोकन':
    t.catUnit === 'Unidade' ? 'Pré-visualizar':
    t.catUnit === 'Единица' ? 'Предпросмотр':
    t.catUnit === '単位'    ? 'プレビュー'  :
    t.catUnit === '단위'    ? '미리보기'    :
    'Preview';
  const initLabel =
    t.catUnit === 'Unit'    ? 'Initializing Neural Engine...'        :
    t.catUnit === 'اکائی'   ? 'نیورل انجن شروع ہو رہا ہے...'          :
    t.catUnit === 'وحدة'    ? 'جارٍ تهيئة المحرك العصبي...'           :
    t.catUnit === '单位'    ? '正在初始化神经引擎...'                    :
    t.catUnit === 'Unité'   ? 'Initialisation du moteur neuronal...' :
    t.catUnit === 'Einheit' ? 'Neuronales System wird gestartet...'  :
    t.catUnit === 'Unidad'  ? 'Iniciando motor neuronal...'          :
    t.catUnit === 'इकाई'    ? 'न्यूरल इंजन प्रारंभ हो रहा है...'     :
    t.catUnit === 'Unidade' ? 'Inicializando motor neural...'        :
    t.catUnit === 'Единица' ? 'Инициализация нейронного движка...'   :
    t.catUnit === '単位'    ? 'ニューラルエンジン初期化中...'            :
    t.catUnit === '단위'    ? '신경망 엔진 초기화 중...'               :
    'Initializing Neural Engine...';
  // ── Audio event listeners ────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleAudioEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleAudioEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [file]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTranscription('');
      setQualityCheck(null);
      setShowFullResult(false);
      setCurrentTime(0);
      setDuration(0);
      setPlaybackSpeed(1);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(selectedFile);
        audioRef.current.playbackRate = 1;
      }
    }
  };
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  };
  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const changePlaybackSpeed = (speed: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const downloadCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!qualityCheck) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Call Quality Audit Report\n\n";
    csvContent += "Attribute,Status,Reason\n";
    qualityCheck.forEach(item => {
      const safeAttr = item.attr.replace(/"/g, '""');
      const safeSt = item.st.toUpperCase();
      const safeReason = item.reason.replace(/"/g, '""');
      csvContent += `"${safeAttr}","${safeSt}","${safeReason}"\n`;
    });
    if (transcription) {
      csvContent += "\n\nFull Transcription\n";
      const plainTranscript = transcription.replace(/<\/?[^>]+(>|$)/g, "").replace(/"/g, '""');
      csvContent += `"${plainTranscript}"\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `QA_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadExcel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!qualityCheck) return;
    let excelContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    excelContent += `<head><meta charset="UTF-8"></head><body>`;
    excelContent += `<h2>Call Quality Audit Report</h2>`;
    excelContent += `<table border="1" cellspacing="0" cellpadding="5">`;
    excelContent += `<tr style="background-color:#059669; color:white; font-weight:bold;"><th>Attribute</th><th>Status</th><th>Reason</th></tr>`;
    qualityCheck.forEach(item => {
      const stColor = item.st === 'yes' ? '#d1fae5' : item.st === 'no' ? '#fee2e2' : '#f3f4f6';
      const stTextColor = item.st === 'yes' ? '#065f46' : item.st === 'no' ? '#991b1b' : '#374151';
      excelContent += `<tr>`;
      excelContent += `<td><b>${item.attr}</b></td>`;
      excelContent += `<td align="center" style="background-color:${stColor}; color:${stTextColor}; font-weight:bold;">${item.st.toUpperCase()}</td>`;
      excelContent += `<td><i>${item.reason}</i></td>`;
      excelContent += `</tr>`;
    });
    excelContent += `</table>`;
    if (transcription) {
      excelContent += `<br/><h3>Full Transcription</h3>`;
      const plainTranscript = transcription.replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, "<br/>");
      excelContent += `<p style="font-size:11pt; font-family:Calibri; max-w:800px;">${plainTranscript}</p>`;
    }
    excelContent += `</body></html>`;
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `QA_Audit_Report_${Date.now()}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const runQualityAudit = (text: string) => {
    const lowerText = text.toLowerCase();
    const hasBadLang = OFFENSIVE_WORDS_DATABASE.some(w => lowerText.includes(w));
    const hasGreeting = lowerText.includes("hello") || lowerText.includes("good day") || lowerText.includes("thank you for calling");
    const hasNextSteps = lowerText.includes("will") || lowerText.includes("next") || lowerText.includes("send") || lowerText.includes("call");
    const hasPoliteEnd = lowerText.includes("bye") || lowerText.includes("take care") || lowerText.includes("thank you");
    const checklist = [
      { attr: "Professional Greeting", st: hasGreeting ? "yes" : "no", reason: hasGreeting ? "Standard professional opening detected." : "No clear introduction or purpose stated." },
      { attr: "Caller Verification", st: "na", reason: "Verification steps not evident from transcript." },
      { attr: "Rapport Building", st: hasBadLang ? "no" : "yes", reason: hasBadLang ? "Tense conversation with offensive language." : "Professional rapport maintained." },
      { attr: "Probing Questions", st: (lowerText.includes("what") || lowerText.includes("how")) ? "yes" : "no", reason: "Analysis of clarifying questions." },
      { attr: "Active Listening", st: (lowerText.includes("okay") || lowerText.includes("mhm") || lowerText.includes("i see")) ? "yes" : "no", reason: "Verbal nods detected." },
      { attr: "No Jargon/Slang", st: hasBadLang ? "no" : "yes", reason: hasBadLang ? "Slang like offensive words used." : "Clean professional language." },
      { attr: "Empathy & Politeness", st: hasBadLang ? "no" : "yes", reason: hasBadLang ? "Conversation lacks empathy due to tone." : "Polite interaction." },
      { attr: "Logical Flow", st: text.length > 100 ? "yes" : "no", reason: "Structure of conversation analysis." },
      { attr: "Next Steps Defined", st: hasNextSteps ? "yes" : "no", reason: hasNextSteps ? "Future actions were clearly stated." : "No clear next steps discussed." },
      { attr: "Polite Ending", st: hasPoliteEnd ? "yes" : "no", reason: hasPoliteEnd ? "Professional conclusion detected." : "Call ends abruptly without polite conclusion." }
    ];
    setQualityCheck(checklist);
  };
  const startTranscription = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(initLabel);
    setShowFullResult(true);
    try {
      const { pipeline } = await Function(`return import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2")`)();
      const modelName = langMode === 'en' ? 'Xenova/whisper-tiny.en' : 'Xenova/whisper-base';
      const transcriber = await pipeline('automatic-speech-recognition', modelName);
      const output = await transcriber(URL.createObjectURL(file), {
        chunk_length_s: 30, stride_length_s: 5, task: 'transcribe', return_timestamps: true
      });
      let rawText = output.chunks ? output.chunks.map((c: any) => `[${formatTime(c.timestamp[0])}]: ${c.text}`).join('\n\n') : output.text;
      runQualityAudit(rawText);
      setTranscription(rawText);
      setStatus('Completed');
    } catch (error) {
      setStatus('Error');
    } finally {
      setLoading(false);
    }
  };
  const highlightOffensive = (text: string) => {
    let html = text;
    OFFENSIVE_WORDS_DATABASE.forEach(word => {
      const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${safeWord}\\b`, 'gi');
      html = html.replace(regex, (m) => `<span class="text-red-600 bg-red-500/10 px-1 rounded font-bold">${m}</span>`);
    });
    return html;
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full h-full sm:h-[90vh] max-w-6xl bg-white dark:bg-[#121212] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-white/5">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-600/20">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800 dark:text-white tracking-tight">
                {toolTitle}
              </h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em]">
                {subtitleLabel}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar Panel */}
          <div className={`w-full lg:w-72 border-r border-gray-100 dark:border-white/5 p-6 bg-white dark:bg-[#151515] overflow-y-auto ${showFullResult && (loading || transcription) ? 'hidden lg:block' : 'block'}`}>
            <div className="space-y-6">
              {/* Engine Tuning */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  {engineTuningLabel}
                </label>
                <div className="flex bg-gray-100 dark:bg-black/40 p-1 rounded-xl border border-gray-200 dark:border-white/5">
                  <button
                    onClick={() => setLangMode('en')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${langMode === 'en' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLangMode('multilingual')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${langMode === 'multilingual' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400'}`}
                  >
                    Urdu / Multi
                  </button>
                </div>
              </div>
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center relative group bg-gray-50/50 dark:bg-transparent">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={loading}
                />
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                <p className="text-xs font-bold text-gray-500 max-w-full truncate">
                  {file ? file.name : chooseFileLabel}
                </p>
              </div>
              {/* Audio Controls */}
              {file && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? pauseLabel : playLabel} {previewLabel}
                  </button>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleProgressBarChange}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1 border-t border-gray-200/50 dark:border-white/5">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
                      <FastForward className="w-3 h-3 text-emerald-600" /> {speedLabel}
                    </span>
                    <div className="grid grid-cols-5 gap-1 bg-white dark:bg-black/40 p-0.5 rounded-lg border border-gray-200/60 dark:border-white/5">
                      {[1, 1.5, 2, 3, 4].map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => changePlaybackSpeed(speed)}
                          className={`py-1 text-[10px] font-black rounded-md transition-all ${playbackSpeed === speed ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Transcribe Button */}
              <button
                onClick={startTranscription}
                disabled={!file || loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {loading ? processingLabel : transcribeLabel}
              </button>
            </div>
          </div>
          {/* Main Viewport */}
          <div className={`flex-1 p-4 sm:p-8 bg-gray-50 dark:bg-black/20 overflow-y-auto ${showFullResult || transcription ? 'block' : 'hidden lg:block'}`}>
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" /> {resultLabel}
                </h3>
                {showFullResult && transcription && (
                  <button
                    onClick={() => setShowFullResult(false)}
                    className="lg:hidden p-2 bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="bg-white dark:bg-[#181818] rounded-3xl border border-gray-200 dark:border-white/5 min-h-[400px] shadow-sm flex flex-col overflow-hidden">
                {loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{status}</p>
                  </div>
                ) : transcription ? (
                  <div className="p-1 space-y-1">
                    {/* Collapsible Audit Table */}
                    <div className="m-4 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                      <div className="w-full p-4 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between text-left">
                        <button
                          type="button"
                          onClick={() => setIsTableExpanded(!isTableExpanded)}
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
                            {auditLabel}
                          </span>
                          {isTableExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                            : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          }
                        </button>
                        {/* Export Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={downloadCSV}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 text-[10px] font-black text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all uppercase tracking-tight"
                          >
                            <Download className="w-3 h-3 text-emerald-600" /> CSV
                          </button>
                          <button
                            type="button"
                            onClick={downloadExcel}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 text-[10px] font-black text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all uppercase tracking-tight"
                          >
                            <Download className="w-3 h-3 text-emerald-600" /> Excel
                          </button>
                        </div>
                      </div>
                      {isTableExpanded && (
                        <div className="overflow-x-auto transition-all">
                          <table className="w-full text-left text-[11px]">
                            <thead>
                              <tr className="bg-gray-50/30 text-gray-400 border-b border-gray-100 dark:border-white/5">
                                <th className="p-4 font-black uppercase tracking-tighter">Attribute</th>
                                <th className="p-4 font-black uppercase tracking-tighter text-center">ST</th>
                                <th className="p-4 font-black uppercase tracking-tighter">Reason</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                              {qualityCheck?.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{item.attr}</td>
                                  <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.st === 'yes' ? 'bg-emerald-100 text-emerald-700' : item.st === 'no' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                                      {item.st}
                                    </span>
                                  </td>
                                  <td className="p-4 text-gray-500 italic leading-snug">{item.reason}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    {/* Transcription Text */}
                    <div className="p-6 border-t border-gray-100 dark:border-white/5">
                      <p
                        className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightOffensive(transcription) }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center opacity-40 p-12 text-center space-y-4">
                    <FileAudio className="w-16 h-16 text-gray-200" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {noTranscriptionLabel}
                    </p>
                  </div>
                )}
              </div>
              {/* Privacy Notice */}
              <div className="p-5 bg-[#ebf9f5] dark:bg-emerald-600/5 border border-emerald-100 dark:border-emerald-600/10 rounded-2xl flex items-center gap-4 transition-all">
                <div className="p-2 bg-white dark:bg-emerald-600/10 rounded-full shadow-sm">
                  <Info className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] font-bold text-emerald-800/80 dark:text-emerald-400/80">
                  {privacyLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};
export default AudioTranscriber;