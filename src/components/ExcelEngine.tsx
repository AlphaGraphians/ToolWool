"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Download, Plus, Wand2, Trash2, Columns, X, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
interface ExcelEngineProps {
  onClose: () => void;
}
const ExcelEngine: React.FC<ExcelEngineProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [data, setData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [timeFormat, setTimeFormat] = useState<string>("12");
  // ── Derived labels (not in core t) ──────────────────────────────────────────
  const toolTitle = t.catText === 'Text' ? 'Excel Data Engine'
    : t.catText === 'متن' ? 'ایکسل ڈیٹا انجن'
    : t.catText === 'نص' ? 'محرك بيانات Excel'
    : t.catText === '文本' ? 'Excel 数据引擎'
    : t.catText === 'Texte' ? 'Moteur de données Excel'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Excel-Daten-Engine'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Motor de datos Excel'
    : t.catText === 'पाठ' ? 'Excel डेटा इंजन'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Motor de dados Excel'
    : t.catText === 'Текст' ? 'Движок данных Excel'
    : t.catText === 'テキスト' ? 'Excelデータエンジン'
    : t.catText === '텍스트' ? 'Excel 데이터 엔진'
    : 'Excel Data Engine';
  const toolSubtitle = t.catText === 'Text' ? 'Smart Transform Module'
    : t.catText === 'متن' ? 'سمارٹ ٹرانسفارم ماڈیول'
    : t.catText === 'نص' ? 'وحدة التحويل الذكي'
    : t.catText === '文本' ? '智能转换模块'
    : t.catText === 'Texte' ? 'Module de transformation intelligent'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Intelligentes Transformationsmodul'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Módulo de transformación inteligente'
    : t.catText === 'पाठ' ? 'स्मार्ट ट्रांसफ़ॉर्म मॉड्यूल'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Módulo de transformação inteligente'
    : t.catText === 'Текст' ? 'Модуль умного преобразования'
    : t.catText === 'テキスト' ? 'スマート変換モジュール'
    : t.catText === '텍스트' ? '스마트 변환 모듈'
    : 'Smart Transform Module';
  const dtSplitterLabel = t.catText === 'Text' ? 'Date-Time Splitter'
    : t.catText === 'متن' ? 'تاریخ-وقت اسپلٹر'
    : t.catText === 'نص' ? 'فاصل التاريخ والوقت'
    : t.catText === '文本' ? '日期时间拆分器'
    : t.catText === 'Texte' ? 'Séparateur Date-Heure'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Datum-Zeit-Teiler'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Separador Fecha-Hora'
    : t.catText === 'पाठ' ? 'दिनांक-समय विभाजक'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Separador Data-Hora'
    : t.catText === 'Текст' ? 'Разделитель даты и времени'
    : t.catText === 'テキスト' ? '日時分割ツール'
    : t.catText === '텍스트' ? '날짜-시간 분리기'
    : 'Date-Time Splitter';
  const selectTargetColLabel = t.catText === 'Text' ? 'Select Target Column'
    : t.catText === 'متن' ? 'ٹارگٹ کالم منتخب کریں'
    : t.catText === 'نص' ? 'اختر العمود المستهدف'
    : t.catText === '文本' ? '选择目标列'
    : t.catText === 'Texte' ? 'Sélectionner la colonne cible'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Zielspalte auswählen'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Seleccionar columna de destino'
    : t.catText === 'पाठ' ? 'लक्ष्य कॉलम चुनें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Selecionar coluna de destino'
    : t.catText === 'Текст' ? 'Выберите целевой столбец'
    : t.catText === 'テキスト' ? 'ターゲット列を選択'
    : t.catText === '텍스트' ? '대상 열 선택'
    : 'Select Target Column';
  const timeFormatLabel = t.catText === 'Text' ? 'Time Format Output'
    : t.catText === 'متن' ? 'وقت فارمیٹ آؤٹ پٹ'
    : t.catText === 'نص' ? 'تنسيق إخراج الوقت'
    : t.catText === '文本' ? '时间格式输出'
    : t.catText === 'Texte' ? 'Format de sortie de l\'heure'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Zeitformat-Ausgabe'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Formato de salida de tiempo'
    : t.catText === 'पाठ' ? 'समय प्रारूप आउटपुट'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Formato de saída de hora'
    : t.catText === 'Текст' ? 'Формат вывода времени'
    : t.catText === 'テキスト' ? '時刻フォーマット出力'
    : t.catText === '텍스트' ? '시간 형식 출력'
    : 'Time Format Output';
  const splitBtnLabel = t.catText === 'Text' ? 'Split & Shift Columns'
    : t.catText === 'متن' ? 'کالم اسپلٹ اور شفٹ کریں'
    : t.catText === 'نص' ? 'تقسيم الأعمدة ونقلها'
    : t.catText === '文本' ? '拆分并移动列'
    : t.catText === 'Texte' ? 'Diviser et déplacer les colonnes'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Spalten teilen & verschieben'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Dividir y desplazar columnas'
    : t.catText === 'पाठ' ? 'कॉलम विभाजित और स्थानांतरित करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Dividir e deslocar colunas'
    : t.catText === 'Текст' ? 'Разделить и сдвинуть столбцы'
    : t.catText === 'テキスト' ? '列を分割してシフト'
    : t.catText === '텍스트' ? '열 분할 및 이동'
    : 'Split & Shift Columns';
  const howToUseLabel = t.catText === 'Text' ? 'How to use this tool'
    : t.catText === 'متن' ? 'اس ٹول کو کیسے استعمال کریں'
    : t.catText === 'نص' ? 'كيفية استخدام هذه الأداة'
    : t.catText === '文本' ? '如何使用此工具'
    : t.catText === 'Texte' ? 'Comment utiliser cet outil'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'So verwenden Sie dieses Tool'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Cómo usar esta herramienta'
    : t.catText === 'पाठ' ? 'इस टूल का उपयोग कैसे करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Como usar esta ferramenta'
    : t.catText === 'Текст' ? 'Как использовать этот инструмент'
    : t.catText === 'テキスト' ? 'このツールの使い方'
    : t.catText === '텍스트' ? '이 도구 사용 방법'
    : 'How to use this tool';
  const step1Label = t.catText === 'Text' ? 'Click the main dropzone to load a spreadsheet file'
    : t.catText === 'متن' ? 'فائل لوڈ کرنے کے لیے ڈراپ زون پر کلک کریں'
    : t.catText === 'نص' ? 'انقر على منطقة الإسقاط لتحميل الملف'
    : t.catText === '文本' ? '点击主拖放区加载电子表格文件'
    : t.catText === 'Texte' ? 'Cliquez sur la zone principale pour charger un fichier'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Klicken Sie auf die Dropzone, um eine Datei zu laden'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Haga clic en la zona principal para cargar un archivo'
    : t.catText === 'पाठ' ? 'स्प्रेडशीट फ़ाइल लोड करने के लिए ड्रॉपज़ोन पर क्लिक करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Clique na área principal para carregar um arquivo'
    : t.catText === 'Текст' ? 'Нажмите на зону загрузки, чтобы загрузить файл'
    : t.catText === 'テキスト' ? 'メインのドロップゾーンをクリックしてファイルを読み込む'
    : t.catText === '텍스트' ? '기본 드롭존을 클릭하여 파일 로드'
    : 'Click the main dropzone to load a spreadsheet file';
  const step2Label = t.catText === 'Text' ? 'Choose the column containing combined date-time timestamps from the dropdown menu'
    : t.catText === 'متن' ? 'ڈراپ ڈاؤن سے تاریخ-وقت والا کالم منتخب کریں'
    : t.catText === 'نص' ? 'اختر العمود الذي يحتوي على طوابع زمنية من القائمة'
    : t.catText === '文本' ? '从下拉菜单中选择包含日期时间的列'
    : t.catText === 'Texte' ? 'Choisissez la colonne contenant les horodatages dans le menu déroulant'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Wählen Sie die Spalte mit kombinierten Zeitstempeln aus dem Dropdown'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Elija la columna con marcas de tiempo del menú desplegable'
    : t.catText === 'पाठ' ? 'ड्रॉपडाउन से दिनांक-समय वाला कॉलम चुनें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Escolha a coluna com carimbos de data/hora no menu suspenso'
    : t.catText === 'Текст' ? 'Выберите столбец с временными метками из выпадающего списка'
    : t.catText === 'テキスト' ? 'ドロップダウンから日時を含む列を選択'
    : t.catText === '텍스트' ? '드롭다운에서 날짜-시간이 포함된 열 선택'
    : 'Choose the column containing combined date-time timestamps from the dropdown menu';
  const step3Label = t.catText === 'Text' ? 'Toggle between standard 12-Hour (AM/PM) format or 24-Hour continuous format'
    : t.catText === 'متن' ? '12 گھنٹے (AM/PM) یا 24 گھنٹے فارمیٹ منتخب کریں'
    : t.catText === 'نص' ? 'اختر بين تنسيق 12 ساعة أو 24 ساعة'
    : t.catText === '文本' ? '在12小时和24小时格式之间切换'
    : t.catText === 'Texte' ? 'Basculez entre le format 12 heures (AM/PM) et 24 heures'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Zwischen 12-Stunden (AM/PM) und 24-Stunden-Format umschalten'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Alternar entre formato de 12 horas (AM/PM) y 24 horas'
    : t.catText === 'पाठ' ? '12-घंटे (AM/PM) या 24-घंटे प्रारूप के बीच चुनें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Alternar entre formato de 12 horas (AM/PM) e 24 horas'
    : t.catText === 'Текст' ? 'Переключайтесь между 12-часовым (AM/PM) и 24-часовым форматом'
    : t.catText === 'テキスト' ? '12時間（AM/PM）と24時間形式を切り替え'
    : t.catText === '텍스트' ? '12시간(AM/PM)과 24시간 형식 간 전환'
    : 'Toggle between standard 12-Hour (AM/PM) format or 24-Hour continuous format';
  const step4Label = t.catText === 'Text' ? 'Click "Split & Shift Columns". The tool inserts a fresh time column dynamically without overwriting adjacent values'
    : t.catText === 'متن' ? '"اسپلٹ اور شفٹ" پر کلک کریں — ٹول نئی ٹائم کالم متحرک طور پر شامل کرتا ہے'
    : t.catText === 'نص' ? 'انقر فوق "تقسيم الأعمدة". تضاف خانة الوقت الجديدة ديناميكيًا'
    : t.catText === '文本' ? '点击"拆分并移动列"，工具会动态插入新的时间列'
    : t.catText === 'Texte' ? 'Cliquez sur "Diviser". L\'outil insère dynamiquement une colonne d\'heure'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Klicken Sie auf "Teilen". Das Tool fügt dynamisch eine neue Zeitspalte ein'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Haga clic en "Dividir". La herramienta inserta dinámicamente una columna de tiempo'
    : t.catText === 'पाठ' ? '"विभाजित करें" पर क्लिक करें। टूल गतिशील रूप से एक नया समय कॉलम डालता है'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Clique em "Dividir". A ferramenta insere dinamicamente uma nova coluna de hora'
    : t.catText === 'Текст' ? 'Нажмите "Разделить". Инструмент динамически добавляет новый столбец времени'
    : t.catText === 'テキスト' ? '「列を分割」をクリック。ツールが動的に新しい時刻列を挿入します'
    : t.catText === '텍스트' ? '"열 분할"을 클릭하세요. 도구가 동적으로 새 시간 열을 삽입합니다'
    : 'Click "Split & Shift Columns". The tool inserts a fresh time column dynamically without overwriting adjacent values';
  const uploadLabel = t.catText === 'Text' ? 'Import Spreadsheet Dataset'
    : t.catText === 'متن' ? 'اسپریڈشیٹ فائل درآمد کریں'
    : t.catText === 'نص' ? 'استيراد بيانات جدول البيانات'
    : t.catText === '文本' ? '导入电子表格数据集'
    : t.catText === 'Texte' ? 'Importer le jeu de données'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Tabellendatensatz importieren'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Importar conjunto de datos'
    : t.catText === 'पाठ' ? 'स्प्रेडशीट डेटासेट आयात करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Importar conjunto de dados'
    : t.catText === 'Текст' ? 'Импортировать таблицу данных'
    : t.catText === 'テキスト' ? 'スプレッドシートをインポート'
    : t.catText === '텍스트' ? '스프레드시트 데이터셋 가져오기'
    : 'Import Spreadsheet Dataset';
  const activeFileLabel = t.catText === 'Text' ? 'Active File'
    : t.catText === 'متن' ? 'فعال فائل'
    : t.catText === 'نص' ? 'الملف النشط'
    : t.catText === '文本' ? '当前文件'
    : t.catText === 'Texte' ? 'Fichier actif'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Aktive Datei'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Archivo activo'
    : t.catText === 'पाठ' ? 'सक्रिय फ़ाइल'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Arquivo ativo'
    : t.catText === 'Текст' ? 'Активный файл'
    : t.catText === 'テキスト' ? 'アクティブファイル'
    : t.catText === '텍스트' ? '활성 파일'
    : 'Active File';
  const exportBtnLabel = t.catText === 'Text' ? 'Export Processed Sheet'
    : t.catText === 'متن' ? 'پروسیسڈ شیٹ برآمد کریں'
    : t.catText === 'نص' ? 'تصدير الورقة المعالجة'
    : t.catText === '文本' ? '导出处理后的表格'
    : t.catText === 'Texte' ? 'Exporter la feuille traitée'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Verarbeitetes Blatt exportieren'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Exportar hoja procesada'
    : t.catText === 'पाठ' ? 'प्रोसेस की गई शीट निर्यात करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Exportar planilha processada'
    : t.catText === 'Текст' ? 'Экспортировать обработанный лист'
    : t.catText === 'テキスト' ? '処理済みシートをエクスポート'
    : t.catText === '텍스트' ? '처리된 시트 내보내기'
    : 'Export Processed Sheet';
  const clearDatasetLabel = t.catText === 'Text' ? 'Clear Current Dataset'
    : t.catText === 'متن' ? 'موجودہ ڈیٹا صاف کریں'
    : t.catText === 'نص' ? 'مسح مجموعة البيانات الحالية'
    : t.catText === '文本' ? '清除当前数据集'
    : t.catText === 'Texte' ? 'Effacer le jeu de données actuel'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Aktuellen Datensatz löschen'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Borrar conjunto de datos actual'
    : t.catText === 'पाठ' ? 'वर्तमान डेटासेट साफ़ करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Limpar conjunto de dados atual'
    : t.catText === 'Текст' ? 'Очистить текущий набор данных'
    : t.catText === 'テキスト' ? '現在のデータセットをクリア'
    : t.catText === '텍스트' ? '현재 데이터셋 지우기'
    : 'Clear Current Dataset';
  const uploadHintLabel = t.catText === 'Text' ? 'Supports .xlsx, .xls, .csv'
    : t.catText === 'متن' ? '.xlsx, .xls, .csv سپورٹ کرتا ہے'
    : t.catText === 'نص' ? 'يدعم .xlsx و .xls و .csv'
    : t.catText === '文本' ? '支持 .xlsx, .xls, .csv'
    : t.catText === 'Texte' ? 'Supporte .xlsx, .xls, .csv'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Unterstützt .xlsx, .xls, .csv'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Admite .xlsx, .xls, .csv'
    : t.catText === 'पाठ' ? '.xlsx, .xls, .csv समर्थित'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Suporta .xlsx, .xls, .csv'
    : t.catText === 'Текст' ? 'Поддерживает .xlsx, .xls, .csv'
    : t.catText === 'テキスト' ? '.xlsx, .xls, .csv に対応'
    : t.catText === '텍스트' ? '.xlsx, .xls, .csv 지원'
    : 'Supports .xlsx, .xls, .csv';
  const uploadStepLabel = t.catText === 'Text' ? 'Upload'
    : t.catText === 'متن' ? 'اپ لوڈ'
    : t.catText === 'نص' ? 'رفع'
    : t.catText === '文本' ? '上传'
    : t.catText === 'Texte' ? 'Téléverser'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Hochladen'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Subir'
    : t.catText === 'पाठ' ? 'अपलोड'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Carregar'
    : t.catText === 'Текст' ? 'Загрузить'
    : t.catText === 'テキスト' ? 'アップロード'
    : t.catText === '텍스트' ? '업로드'
    : 'Upload';
  const selectTargetStepLabel = t.catText === 'Text' ? 'Select Target'
    : t.catText === 'متن' ? 'ہدف منتخب کریں'
    : t.catText === 'نص' ? 'اختر الهدف'
    : t.catText === '文本' ? '选择目标'
    : t.catText === 'Texte' ? 'Sélectionner la cible'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Ziel auswählen'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Seleccionar destino'
    : t.catText === 'पाठ' ? 'लक्ष्य चुनें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Selecionar destino'
    : t.catText === 'Текст' ? 'Выбрать цель'
    : t.catText === 'テキスト' ? 'ターゲット選択'
    : t.catText === '텍스트' ? '대상 선택'
    : 'Select Target';
  const chooseFormatStepLabel = t.catText === 'Text' ? 'Choose Format'
    : t.catText === 'متن' ? 'فارمیٹ چنیں'
    : t.catText === 'نص' ? 'اختر التنسيق'
    : t.catText === '文本' ? '选择格式'
    : t.catText === 'Texte' ? 'Choisir le format'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Format wählen'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Elegir formato'
    : t.catText === 'पाठ' ? 'प्रारूप चुनें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Escolher formato'
    : t.catText === 'Текст' ? 'Выбрать формат'
    : t.catText === 'テキスト' ? 'フォーマットを選択'
    : t.catText === '텍스트' ? '형식 선택'
    : 'Choose Format';
  const processStepLabel = t.catText === 'Text' ? 'Process'
    : t.catText === 'متن' ? 'پروسیس کریں'
    : t.catText === 'نص' ? 'معالجة'
    : t.catText === '文本' ? '处理'
    : t.catText === 'Texte' ? 'Traiter'
    : t.catText === 'Text' && t.close === 'Schließen' ? 'Verarbeiten'
    : t.catText === 'Texto' && t.close === 'Cerrar' ? 'Procesar'
    : t.catText === 'पाठ' ? 'प्रोसेस करें'
    : t.catText === 'Texto' && t.close === 'Fechar' ? 'Processar'
    : t.catText === 'Текст' ? 'Обработать'
    : t.catText === 'テキスト' ? '処理'
    : t.catText === '텍스트' ? '처리'
    : 'Process';
  // ── Logic (unchanged) ────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: false });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      const headersArray = (XLSX.utils.sheet_to_json(ws, { header: 1 })[0] || []) as string[];
      
      const jsonObjects = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { raw: false });
      const rawJsonObjects = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { raw: true });
      const parsedData = jsonObjects.map((obj, rowIndex) => {
        return headersArray.map(header => {
          const formattedVal = obj[header] !== undefined ? String(obj[header]).trim() : "";
          const rawVal = rawJsonObjects[rowIndex]?.[header] !== undefined ? String(rawJsonObjects[rowIndex][header]).trim() : "";
          
          if (formattedVal !== "" && !formattedVal.includes(" ") && rawVal.includes(".")) {
            return `${formattedVal}||${rawVal}`;
          }
          return formattedVal;
        });
      });
      if (headersArray.length > 0) {
        setHeaders(headersArray.map(h => h || ""));
        setData(parsedData);
        setSelectedColumn(headersArray[0] || "");
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleSplitDateTime = () => {
    if (!selectedColumn || data.length === 0) return;
    const targetIdx = headers.indexOf(selectedColumn);
    if (targetIdx === -1) return;
    const newHeaders = [...headers];
    newHeaders.splice(targetIdx + 1, 0, `${selectedColumn} (Time)`);
    newHeaders[targetIdx] = `${selectedColumn} (Date)`;
    const newData = data.map((row) => {
      const newRow = [...row];
      while (newRow.length < headers.length) {
        newRow.push("");
      }
      const rawCellStr = newRow[targetIdx] || "";
      let formattedStr = rawCellStr;
      let embeddedRaw = "";
      if (rawCellStr.includes("||")) {
        const splitParts = rawCellStr.split("||");
        formattedStr = splitParts[0] || "";
        embeddedRaw = splitParts[1] || "";
      }
      let datePart = formattedStr;
      let timePart = "";
      const spaceParts = formattedStr.split(/[\sT]+/);
      if (spaceParts.length >= 2 && spaceParts[1].includes(":")) {
        datePart = spaceParts[0] || "";
        timePart = spaceParts[1] || "";
      } 
      else if (embeddedRaw !== "" && !isNaN(Number(embeddedRaw))) {
        const rawNum = Number(embeddedRaw);
        const serialDate = Math.floor(rawNum);
        const serialTime = rawNum - serialDate;
        if (serialTime > 0) {
          const totalSeconds = Math.round(serialTime * 24 * 60 * 60);
          const hours24 = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          const minStr = minutes < 10 ? `0${minutes}` : minutes;
          const secStr = seconds < 10 ? `0${seconds}` : seconds;
          if (timeFormat === "12") {
            const ampm = hours24 >= 12 ? 'PM' : 'AM';
            let hours12 = hours24 % 12;
            hours12 = hours12 ? hours12 : 12;
            timePart = `${hours12}:${minStr}:${secStr} ${ampm}`;
          } else {
            const hrStr = hours24 < 10 ? `0${hours24}` : hours24;
            timePart = `${hrStr}:${minStr}:${secStr}`;
          }
        }
        if (!isNaN(Number(datePart))) {
          try {
            const jsDate = XLSX.SSF.parse_date_code(rawNum);
            datePart = `${jsDate.m}/${jsDate.d}/${jsDate.y}`;
          } catch (e) {}
        }
      }
      newRow.splice(targetIdx + 1, 0, timePart);
      newRow[targetIdx] = datePart;
      return newRow;
    });
    setHeaders(newHeaders);
    setData(newData);
  };
  const handleReset = () => {
    setData([]);
    setHeaders([]);
    setFileName("");
    setSelectedColumn("");
  };
  const exportToExcel = () => {
    const finalContent = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(finalContent);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Processed_Data");
    XLSX.writeFile(wb, fileName ? `Processed_${fileName}` : "ToolWool_Export.xlsx");
  };
  // ── JSX (layout & styles unchanged) ─────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-white/5">
        
        {/* Header Control Panels */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white">{toolTitle}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{toolSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {/* Dashboard Frame Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          
          {/* Settings Side Panel */}
          <div className="w-full lg:w-80 border-r border-gray-200 dark:border-white/5 p-6 flex flex-col justify-between overflow-y-auto bg-white dark:bg-[#151515]">
            <div className="space-y-6">
              {data.length > 0 && (
                <div className="space-y-5">
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Columns className="w-3 h-3" /> {dtSplitterLabel}
                  </label>
                  
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500">{selectTargetColLabel}</span>
                    <select 
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none text-gray-700 dark:text-gray-300"
                    >
                      {headers.map((header, idx) => (
                        <option key={idx} value={header}>{header || `Column ${idx + 1}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500">{timeFormatLabel}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setTimeFormat("12")}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${timeFormat === "12" ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-transparent text-gray-400 border-gray-200 dark:border-white/5'}`}
                      >
                        12 Hour (AM/PM)
                      </button>
                      <button 
                        onClick={() => setTimeFormat("24")}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${timeFormat === "24" ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-transparent text-gray-400 border-gray-200 dark:border-white/5'}`}
                      >
                        24 Hour (Military)
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleSplitDateTime}
                    className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-xs"
                  >
                    <Wand2 className="w-4 h-4" /> {splitBtnLabel}
                  </button>
                </div>
              )}
              {/* Documentation Guide Text block */}
              <div className="pt-5 border-t border-gray-100 dark:border-white/5 space-y-3 bg-gray-50/50 dark:bg-black/20 p-4 rounded-xl">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-green-600" /> {howToUseLabel}
                </h4>
                <ul className="space-y-2.5 text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">1.</span>
                    <span><strong>{uploadStepLabel}:</strong> {step1Label} (<code className="font-mono bg-gray-100 dark:bg-white/5 px-1 rounded">.csv</code>, <code className="font-mono bg-gray-100 dark:bg-white/5 px-1 rounded">.xlsx</code>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">2.</span>
                    <span><strong>{selectTargetStepLabel}:</strong> {step2Label}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">3.</span>
                    <span><strong>{chooseFormatStepLabel}:</strong> {step3Label}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">4.</span>
                    <span><strong>{processStepLabel}:</strong> {step4Label}</span>
                  </li>
                </ul>
              </div>
            </div>
            {data.length > 0 && (
              <div className="pt-4">
                <button 
                  onClick={handleReset}
                  className="w-full py-2.5 border border-red-200 dark:border-red-900/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs"
                >
                  <Trash2 className="w-4 h-4" /> {clearDatasetLabel}
                </button>
              </div>
            )}
          </div>
          {/* Viewport Spreadsheet Grid Map View */}
          <div className="flex-1 p-6 overflow-auto">
            {!data.length ? (
              <div className="h-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-black/10 transition-all hover:border-green-600/30">
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" id="excel-main-file" />
                <label htmlFor="excel-main-file" className="cursor-pointer group flex flex-col items-center text-center p-8">
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{uploadLabel}</span>
                  <span className="text-xs text-gray-400 mt-1">{uploadHintLabel}</span>
                </label>
              </div>
            ) : (
              <div className="h-full flex flex-col space-y-4">
                <div className="flex justify-between items-center bg-white dark:bg-[#151515] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="truncate pr-4">
                    <span className="text-xs font-bold text-gray-400 uppercase block tracking-wider">{activeFileLabel}</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{fileName}</span>
                  </div>
                  <button 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" /> {exportBtnLabel}
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto border border-gray-200 dark:border-white/5 rounded-xl shadow-inner bg-white dark:bg-black/20">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-[#181818] z-10 shadow-sm">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="p-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/5 whitespace-nowrap">{h || `Header ${i+1}`}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                          {headers.map((_, j) => {
                            const rawCellStr = row[j] || "";
                            const displayStr = rawCellStr.includes("||") ? rawCellStr.split("||")[0] : rawCellStr;
                            return (
                              <td key={j} className="p-3.5 text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-nowrap">
                                {displayStr}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExcelEngine;