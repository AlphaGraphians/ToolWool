"use client";
import React, { useState, useEffect } from 'react';
import { Music, Zap, X, Copy, Target, BookOpen, ChevronLeft, ChevronRight, Clock, Video } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
interface BeatSyncProps {
  onClose: () => void;
}
const BeatSync: React.FC<BeatSyncProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [bpm, setBpm] = useState<number>(120);
  const [fps, setFps] = useState<number>(30);
  const [duration, setDuration] = useState<number>(15);
  const [taps, setTaps] = useState<number[]>([]);
  const [markers, setMarkers] = useState<{frame: number, time: string}[]>([]);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [guideLang, setGuideLang] = useState<'en' | 'ur'>('en');
  const [copyDone, setCopyDone] = useState(false);
  useEffect(() => {
    calculateMarkers();
  }, [bpm, fps, duration]);
  const calculateMarkers = () => {
    const beatInterval = 60 / bpm;
    const tempMarkers = [];
    for (let time = beatInterval; time <= duration; time += beatInterval) {
      const frame = Math.round(time * fps);
      tempMarkers.push({ frame, time: time.toFixed(2) });
    }
    setMarkers(tempMarkers);
  };
  const handleTap = () => {
    const now = Date.now();
    const newTaps = [...taps, now].slice(-4);
    setTaps(newTaps);
    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i-1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      setBpm(Math.round(60000 / avgInterval));
    }
  };
  const copyToClipboard = () => {
    const text = markers.map(m => `Frame: ${m.frame} (${m.time}s)`).join('\n');
    navigator.clipboard.writeText(text);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1800);
  };
  // ── Derived labels (not in core t) ──────────────────────────────────────────
  const toolSubtitle = t.catText === 'Text' ? 'Viral Pacing Architecture'
    : t.catText === 'متن' ? 'وائرل پیسنگ آرکیٹیکچر'
    : t.catText === 'نص' ? 'هندسة الإيقاع الفيروسي'
    : t.catText === '文本' ? '病毒式节奏架构'
    : t.catText === 'Texte' ? 'Architecture de rythme viral'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Virale Tempo-Architektur'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Arquitectura de ritmo viral'
    : t.catText === 'पाठ' ? 'वायरल पेसिंग आर्किटेक्चर'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Arquitetura de ritmo viral'
    : t.catText === 'Текст' ? 'Архитектура вирусного темпа'
    : t.catText === 'テキスト' ? 'バイラルペーシングアーキテクチャ'
    : t.catText === '텍스트' ? '바이럴 페이싱 아키텍처'
    : 'Viral Pacing Architecture';
  const guideBtn = t.catText === 'Text' ? 'Comprehensive Guide'
    : t.catText === 'متن' ? 'مکمل گائیڈ'
    : t.catText === 'نص' ? 'الدليل الشامل'
    : t.catText === '文本' ? '综合指南'
    : t.catText === 'Texte' ? 'Guide complet'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Umfassender Leitfaden'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Guía completa'
    : t.catText === 'पाठ' ? 'व्यापक गाइड'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Guia abrangente'
    : t.catText === 'Текст' ? 'Полное руководство'
    : t.catText === 'テキスト' ? '総合ガイド'
    : t.catText === '텍스트' ? '종합 가이드'
    : 'Comprehensive Guide';
  const engineConfigLabel = t.catText === 'Text' ? 'Engine Configuration'
    : t.catText === 'متن' ? 'انجن کنفیگریشن'
    : t.catText === 'نص' ? 'إعداد المحرك'
    : t.catText === '文本' ? '引擎配置'
    : t.catText === 'Texte' ? 'Configuration du moteur'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Engine-Konfiguration'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Configuración del motor'
    : t.catText === 'पाठ' ? 'इंजन कॉन्फ़िगरेशन'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Configuração do motor'
    : t.catText === 'Текст' ? 'Конфигурация движка'
    : t.catText === 'テキスト' ? 'エンジン設定'
    : t.catText === '텍스트' ? '엔진 구성'
    : 'Engine Configuration';
  const musicBpmLabel = t.catText === 'Text' ? 'Music BPM'
    : t.catText === 'متن' ? 'موسیقی BPM'
    : t.catText === 'نص' ? 'إيقاع الموسيقى'
    : t.catText === '文本' ? '音乐 BPM'
    : t.catText === 'Texte' ? 'BPM musical'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Musik BPM'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'BPM musical'
    : t.catText === 'पाठ' ? 'संगीत BPM'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'BPM musical'
    : t.catText === 'Текст' ? 'Музыкальный BPM'
    : t.catText === 'テキスト' ? '音楽 BPM'
    : t.catText === '텍스트' ? '음악 BPM'
    : 'Music BPM';
  const projectFpsLabel = t.catText === 'Text' ? 'Project FPS'
    : t.catText === 'متن' ? 'پروجیکٹ FPS'
    : t.catText === 'نص' ? 'إطارات المشروع'
    : t.catText === '文本' ? '项目 FPS'
    : t.catText === 'Texte' ? 'FPS du projet'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Projekt FPS'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'FPS del proyecto'
    : t.catText === 'पाठ' ? 'प्रोजेक्ट FPS'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'FPS do projeto'
    : t.catText === 'Текст' ? 'FPS проекта'
    : t.catText === 'テキスト' ? 'プロジェクト FPS'
    : t.catText === '텍스트' ? '프로젝트 FPS'
    : 'Project FPS';
  const timelineLabel = t.catText === 'Text' ? 'Timeline (s)'
    : t.catText === 'متن' ? 'ٹائم لائن (سیکنڈ)'
    : t.catText === 'نص' ? 'الجدول الزمني (ث)'
    : t.catText === '文本' ? '时间轴 (秒)'
    : t.catText === 'Texte' ? 'Durée (s)'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Timeline (s)'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Línea de tiempo (s)'
    : t.catText === 'पाठ' ? 'टाइमलाइन (सेकंड)'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Linha do tempo (s)'
    : t.catText === 'Текст' ? 'Таймлайн (с)'
    : t.catText === 'テキスト' ? 'タイムライン (秒)'
    : t.catText === '텍스트' ? '타임라인 (초)'
    : 'Timeline (s)';
  const tapTempoSubLabel = t.catText === 'Text' ? 'MATCH THE BEAT'
    : t.catText === 'متن' ? 'بیٹ کے ساتھ ملائیں'
    : t.catText === 'نص' ? 'طابق الإيقاع'
    : t.catText === '文本' ? '跟随节拍'
    : t.catText === 'Texte' ? 'SUIVEZ LE RYTHME'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'BEAT FOLGEN'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'SIGUE EL RITMO'
    : t.catText === 'पाठ' ? 'बीट से मिलाएं'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'SIGA O RITMO'
    : t.catText === 'Текст' ? 'В ТАКТ МУЗЫКЕ'
    : t.catText === 'テキスト' ? 'ビートに合わせて'
    : t.catText === '텍스트' ? '비트에 맞추세요'
    : 'MATCH THE BEAT';
  const frameMarkersLabel = t.catText === 'Text' ? 'Frame Markers List'
    : t.catText === 'متن' ? 'فریم مارکرز لسٹ'
    : t.catText === 'نص' ? 'قائمة علامات الإطار'
    : t.catText === '文本' ? '帧标记列表'
    : t.catText === 'Texte' ? 'Liste des marqueurs de frames'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Frame-Markierungsliste'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Lista de marcadores de fotogramas'
    : t.catText === 'पाठ' ? 'फ्रेम मार्कर सूची'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Lista de marcadores de quadros'
    : t.catText === 'Текст' ? 'Список маркеров кадров'
    : t.catText === 'テキスト' ? 'フレームマーカーリスト'
    : t.catText === '텍스트' ? '프레임 마커 목록'
    : 'Frame Markers List';
  const copyMarkersLabel = copyDone ? t.copied
    : t.catText === 'Text' ? 'Copy Markers'
    : t.catText === 'متن' ? 'مارکرز کاپی کریں'
    : t.catText === 'نص' ? 'نسخ العلامات'
    : t.catText === '文本' ? '复制标记'
    : t.catText === 'Texte' ? 'Copier les marqueurs'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Marker kopieren'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Copiar marcadores'
    : t.catText === 'पाठ' ? 'मार्कर कॉपी करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Copiar marcadores'
    : t.catText === 'Текст' ? 'Копировать маркеры'
    : t.catText === 'テキスト' ? 'マーカーをコピー'
    : t.catText === '텍스트' ? '마커 복사'
    : 'Copy Markers';
  const beatLabel = t.catText === 'Text' ? 'Beat'
    : t.catText === 'متن' ? 'بیٹ'
    : t.catText === 'نص' ? 'إيقاع'
    : t.catText === '文本' ? '节拍'
    : t.catText === 'Texte' ? 'Temps'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Beat'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Tiempo'
    : t.catText === 'पाठ' ? 'बीट'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Batida'
    : t.catText === 'Текст' ? 'Удар'
    : t.catText === 'テキスト' ? 'ビート'
    : t.catText === '텍스트' ? '비트'
    : 'Beat';
  const guideTitle = t.catText === 'Text' ? 'Comprehensive User Guide'
    : t.catText === 'متن' ? 'مکمل صارف گائیڈ'
    : t.catText === 'نص' ? 'دليل المستخدم الشامل'
    : t.catText === '文本' ? '综合用户指南'
    : t.catText === 'Texte' ? 'Guide utilisateur complet'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Umfassender Benutzerhandbuch'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Guía de usuario completa'
    : t.catText === 'पाठ' ? 'व्यापक उपयोगकर्ता गाइड'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Guia completo do usuário'
    : t.catText === 'Текст' ? 'Полное руководство пользователя'
    : t.catText === 'テキスト' ? '総合ユーザーガイド'
    : t.catText === '텍스트' ? '종합 사용자 가이드'
    : 'Comprehensive User Guide';
  // ── JSX (layout & styles unchanged) ─────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/5 h-[85vh] flex flex-col">
        
        {/* Main Header */}
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Music className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white">{t.toolBeatSync}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{toolSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowGuide(true)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-xl text-xs font-bold hover:bg-yellow-500 hover:text-white transition-all border border-yellow-500/20 shadow-sm">
              <BookOpen className="w-4 h-4" /> {guideBtn}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Side Settings */}
          <div className="w-full lg:w-80 border-r border-gray-100 dark:border-white/5 p-6 bg-white dark:bg-[#151515] space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">{engineConfigLabel}</label>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500">{musicBpmLabel}</span>
                <input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-full p-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold focus:border-yellow-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-500">{projectFpsLabel}</span>
                  <select value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full p-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none">
                    <option value={24}>24 FPS</option><option value={30}>30 FPS</option><option value={60}>60 FPS</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-500">{timelineLabel}</span>
                  <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full p-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none">
                    <option value={15}>15s</option><option value={30}>30s</option><option value={60}>60s</option>
                  </select>
                </div>
              </div>
              <button onMouseDown={handleTap} className="w-full py-8 bg-yellow-500 hover:bg-yellow-600 text-black rounded-2xl font-black flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-yellow-500/20">
                <Zap className="w-6 h-6 animate-pulse" />
                <span className="tracking-tighter">TAP TEMPO</span>
                <span className="text-[9px] opacity-70 font-black">{tapTempoSubLabel}</span>
              </button>
            </div>
          </div>
          {/* Markers List */}
          <div className="flex-1 p-6 bg-gray-50 dark:bg-black/20 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-yellow-500" /> {frameMarkersLabel}
              </h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl text-[11px] font-bold hover:shadow-md transition-all"
              >
                <Copy className="w-3.5 h-3.5" /> {copyMarkersLabel}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {markers.map((m, i) => (
                <div key={i} className="p-4 bg-white dark:bg-[#181818] rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center shadow-sm group hover:border-yellow-500/30 transition-all">
                  <span className="text-[9px] font-black text-gray-400 uppercase">{beatLabel} {i+1}</span>
                  <span className="text-xl font-black text-gray-800 dark:text-white group-hover:text-yellow-500">{m.frame}</span>
                  <span className="text-[10px] font-bold text-gray-500">{m.time}s</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── GUIDE MODAL OVERLAY ───────────────────────────────────────────── */}
        {showGuide && (
          <div className="absolute inset-0 z-[110] bg-white dark:bg-[#121212] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#181818]">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold">{guideTitle}</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                  <button onClick={() => setGuideLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${guideLang === 'en' ? 'bg-yellow-500 text-black shadow-sm' : 'text-gray-500'}`}>English</button>
                  <button onClick={() => setGuideLang('ur')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${guideLang === 'ur' ? 'bg-yellow-500 text-black shadow-sm' : 'text-gray-500'}`}>اردو</button>
                </div>
                <button onClick={() => setShowGuide(false)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 transition-all"><X className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className={`flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-12 ${guideLang === 'ur' ? 'text-right' : 'text-left'}`} dir={guideLang === 'ur' ? 'rtl' : 'ltr'}>
              {guideLang === 'en' ? (
                <>
                  <section className="space-y-4">
                    <h4 className="text-xl font-black text-yellow-500 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" /> What is BeatSync Engine?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      The BeatSync Engine is a professional-grade mathematical tool designed for short-form video creators (Shorts, Reels, TikTok). It solves the most common editing problem: <strong>How to cut clips exactly on the beat of the music.</strong> Instead of guessing on a timeline, this engine gives you exact frame numbers for perfect transitions.
                    </p>
                  </section>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg w-fit text-yellow-500"><Clock className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm">Step 1: Determine BPM</h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">Enter the song's BPM manually if you know it. Otherwise, use the <span className="text-yellow-500 font-bold">"TAP TEMPO"</span> button. Play your music and click the button on every main beat; the tool will calculate the average tempo for you.</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg w-fit text-yellow-500"><Video className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm">Step 2: Match Project FPS</h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">Ensure the <span className="text-yellow-500 font-bold">FPS (Frames Per Second)</span> matches your editing software project (usually 30 or 60 FPS for mobile). This is crucial for calculating the exact frame where the cut should occur.</p>
                    </div>
                  </div>
                  <section className="space-y-4 pt-4">
                    <h4 className="text-xl font-black text-yellow-500 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" /> How to Apply to Your Editor
                    </h4>
                    <div className="space-y-4">
                      {[
                        'Copy the calculated marker list using the "Copy Frames" button.',
                        "Open your editor (CapCut, Premiere Pro, DaVinci Resolve).",
                        "Go to the exact frame number provided by the list and place a marker.",
                        "Snap your video clips or transition effects to these markers for a flawless visual experience."
                      ].map((txt, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">0{i+1}</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{txt}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-4">
                    <h4 className="text-xl font-black text-yellow-500 flex items-center gap-2">
                      <ChevronLeft className="w-5 h-5" /> بیٹ سنک انجن کیا ہے؟
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      بیٹ سنک انجن ایک پیشہ ورانہ ریاضیاتی ٹول ہے جو شارٹ ویڈیوز بنانے والوں (Shorts, Reels) کے لیے تیار کیا گیا ہے۔ یہ ایڈیٹنگ کا سب سے بڑا مسئلہ حل کرتا ہے: <strong>ویڈیو کلپس کو موسیقی کی دھن (Beat) کے ساتھ بالکل درست کیسے جوڑا جائے؟</strong> ٹائم لائن پر اندازہ لگانے کے بجائے، یہ انجن آپ کو پرفیکٹ ٹرانزیشن کے لیے درست فریم نمبرز دیتا ہے۔
                    </p>
                  </section>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg w-fit text-yellow-500 self-end"><Clock className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm">مرحلہ 1: موسیقی کی رفتار (BPM) معلوم کریں</h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">اگر آپ کو گانے کا BPM معلوم ہے تو اسے لکھیں۔ ورنہ <span className="text-yellow-500 font-bold">"TAP TEMPO"</span> بٹن کا استعمال کریں۔ موسیقی چلائیں اور ہر بڑی دھن (Beat) پر بٹن کو کلک کریں۔ ٹول اوسط رفتار خود نکال لے گا۔</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg w-fit text-yellow-500 self-end"><Video className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm">مرحلہ 2: پروجیکٹ FPS سے ملائیں</h5>
                      <p className="text-[11px] text-gray-500 leading-relaxed">یقینی بنائیں کہ <span className="text-yellow-500 font-bold">FPS (Frames Per Second)</span> آپ کے ایڈیٹنگ سافٹ ویئر (CapCut وغیرہ) سے میل کھاتا ہو (عام طور پر موبائل کے لیے 30 یا 60)۔ یہ درست فریم معلوم کرنے کے لیے ضروری ہے۔</p>
                    </div>
                  </div>
                  <section className="space-y-4 pt-4">
                    <h4 className="text-xl font-black text-yellow-500 flex items-center gap-2">
                      <ChevronLeft className="w-5 h-5" /> اپنے ایڈیٹر میں کیسے استعمال کریں
                    </h4>
                    <div className="space-y-4">
                      {[
                        '"Copy Frames" بٹن کا استعمال کرتے ہوئے فریم نمبرز کی لسٹ کاپی کریں۔',
                        "اپنا ایڈیٹنگ سافٹ ویئر (CapCut, Premiere Pro وغیرہ) کھولیں۔",
                        "فہرست میں دیے گئے عین فریم نمبر پر جائیں اور وہاں ایک مارکر (Marker) لگائیں۔",
                        "اپنے ویڈیو کلپس یا ٹرانزیشن کو ان مارکرز کے مطابق سیٹ کریں تاکہ ویڈیو موسیقی کی دھن پر بدلتی ہوئی نظر آئے۔"
                      ].map((txt, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">0{i+1}</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{txt}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
              <div className="h-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BeatSync;