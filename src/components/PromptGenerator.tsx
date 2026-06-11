import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, X, BookOpen, Copy, Check,
  ChevronRight, ChevronLeft, Sliders, AlertCircle,
  ChevronDown, LayoutGrid, Shuffle, Wand2, Download,
  Star, Zap, Info, RotateCcw, ArrowUpRight, History,
  Settings2, Eye, EyeOff, PanelLeftClose, PanelLeftOpen,
  Layers, Target, Camera, Palette, Sun, Moon
} from 'lucide-react';
// ─── TYPES ────────────────────────────────────────────────────────────────────
type ModelKey = keyof typeof MODELS;
interface HistoryEntry {
  id: string;
  model: string;
  positive: string;
  negative: string;
  tokens: number;
  timestamp: Date;
  label?: string;
}
// ─── MODEL DEFINITIONS ────────────────────────────────────────────────────────
const MODELS = {
  absolute_qnn: {
    name: 'AbsoluteReality QNN',
    badge: 'NPU',
    badgeColor: 'bg-purple-500',
    accentColor: '#a855f7',
    clipSkip: 2,
    cfgRange: [5, 8] as [number, number],
    steps: [20, 30] as [number, number],
    sampler: 'DPM++ 2M Karras',
    prefix: '(RAW photo:1.2), (photorealistic:1.4), (hyperrealistic:1.3), (masterpiece:1.2), (best quality:1.2), 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3',
    negative: '(worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, ((missing fingers)), extra digit, fewer digits, (fused fingers:1.5), blurry, deformed, mutated, ugly, disgusting, poorly drawn face, bad proportions, gross proportions, extra limbs, cloned face, disfigured, out of frame, extra arms, extra legs, malformed limbs, missing arms, missing legs, watermark, signature, text',
    tip: 'Mobile NPU optimized. Keep prompts under 75 tokens. Use (term:1.2–1.4) weights.',
    strength: 95,
    speed: 90,
  },
  hyperspire: {
    name: 'HyperSpire V5 QNN',
    badge: 'NPU',
    badgeColor: 'bg-purple-500',
    accentColor: '#7c3aed',
    clipSkip: 2,
    cfgRange: [6, 9] as [number, number],
    steps: [25, 35] as [number, number],
    sampler: 'Euler a',
    prefix: '(masterpiece:1.3), (best quality:1.2), (ultra-detailed:1.1), (photorealistic:1.3), cinematic lighting, professional photography, sharp focus, 8k resolution',
    negative: '(worst quality:2.0), (low quality:2.0), (normal quality:2.0), lowres, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, extra fingers, fewer fingers, strange fingers, bad hand, (bad anatomy:1.3), blurry, (duplicate:1.5), watermark, text, signature',
    tip: 'Strong photorealism output. Works well with cinematic + lighting combos.',
    strength: 90,
    speed: 85,
  },
  realisian: {
    name: 'RealisianV6 QNN',
    badge: 'NPU',
    badgeColor: 'bg-purple-500',
    accentColor: '#6366f1',
    clipSkip: 2,
    cfgRange: [5, 7] as [number, number],
    steps: [20, 28] as [number, number],
    sampler: 'DPM++ SDE',
    prefix: '(8k, RAW photo, best quality, masterpiece:1.2), (realistic, photo-realistic:1.37), professional portrait, soft studio lighting, natural skin texture',
    negative: 'EasyNegative, (worst quality:2), (low quality:2), (normal quality:2), lowres, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, extra fingers, fewer fingers, strange fingers, bad hand, signature, watermark, blurry, bad feet, bad leg',
    tip: 'Best for portrait photography. Add EasyNegative embedding if available.',
    strength: 92,
    speed: 88,
  },
  anything_v5: {
    name: 'Anything V5.0',
    badge: 'Anime',
    badgeColor: 'bg-pink-500',
    accentColor: '#ec4899',
    clipSkip: 2,
    cfgRange: [7, 11] as [number, number],
    steps: [20, 30] as [number, number],
    sampler: 'DPM++ 2M Karras',
    prefix: '(masterpiece:1.2), best quality, highres, (1girl:1.1), ultra-detailed, illustration, beautiful detailed eyes, beautiful detailed face',
    negative: 'EasyNegative, (worst quality, low quality:1.4), bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name, (bad proportions:1.2), out of frame',
    tip: 'Anime/illustration focused. Use clip skip 2. Add style tags like (solo:1.2), (standing:1.1).',
    strength: 88,
    speed: 92,
  },
  absolute_cpu: {
    name: 'Absolute Reality CPU',
    badge: 'CPU',
    badgeColor: 'bg-green-500',
    accentColor: '#22c55e',
    clipSkip: 2,
    cfgRange: [5, 8] as [number, number],
    steps: [20, 30] as [number, number],
    sampler: 'DPM++ 2M Karras',
    prefix: '(RAW photo:1.2), (photorealistic:1.4), (hyperrealistic:1.3), (masterpiece:1.2), (best quality:1.2), 8k uhd, dslr, soft lighting',
    negative: '(worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, blurry, deformed, mutated, ugly, watermark, signature, text',
    tip: 'CPU version — slower but same quality. Reduce steps to 20 for speed.',
    strength: 95,
    speed: 40,
  },
  yukimix: {
    name: 'CuteYukiMix',
    badge: 'Anime',
    badgeColor: 'bg-pink-500',
    accentColor: '#f472b6',
    clipSkip: 2,
    cfgRange: [7, 10] as [number, number],
    steps: [20, 28] as [number, number],
    sampler: 'Euler a',
    prefix: '(masterpiece:1.2), (best quality:1.1), (ultra-detailed:1.1), 1girl, cute, kawaii, anime style, vibrant colors, soft shading, expressive eyes, detailed hair',
    negative: 'EasyNegative, (worst quality:2), (low quality:2), bad anatomy, bad hands, missing fingers, (ugly:1.3), (deformed:1.3), blurry, signature, watermark, lowres, monochrome',
    tip: 'Cute anime aesthetic. Best for kawaii/chibi style. Add (chibi:1.2) for cute proportions.',
    strength: 82,
    speed: 93,
  },
  chillout: {
    name: 'ChilloutMix',
    badge: 'Asian',
    badgeColor: 'bg-yellow-500',
    accentColor: '#eab308',
    clipSkip: 2,
    cfgRange: [6, 9] as [number, number],
    steps: [25, 35] as [number, number],
    sampler: 'DPM++ 2M Karras',
    prefix: '(8k, RAW photo, best quality, masterpiece:1.2), (realistic, photo-realistic:1.37), (beautiful detailed face:1.2), (detailed skin:1.1), natural lighting',
    negative: 'EasyNegative, paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, extra fingers, fewer fingers, strange fingers, bad hand, signature, watermark, username, blurry, bad feet',
    tip: 'Specialized for East Asian portraits. Works best with face + lighting details.',
    strength: 91,
    speed: 75,
  },
};
// ─── OPTIONS ──────────────────────────────────────────────────────────────────
const SUBJECT_OPTIONS: Record<string, string> = {
  'Woman Portrait': '(beautiful woman:1.2), (detailed face:1.3), (expressive eyes:1.2)',
  'Man Portrait': '(handsome man:1.1), strong jawline, (detailed face:1.2)',
  'Anime Girl': '(1girl:1.2), anime, (beautiful detailed eyes:1.3), long hair',
  'Anime Boy': '(1boy:1.1), anime, handsome, detailed face',
  'Group Shot': '(multiple people:1.1), group photo, natural poses',
  'Animal / Pet': '(detailed fur:1.2), (realistic animal:1.2), natural habitat',
  'Landscape': 'breathtaking landscape, (ultra-detailed scenery:1.2), natural lighting',
  'Architecture': 'detailed architecture, (realistic building:1.2), professional photography',
  'Food': '(food photography:1.3), (mouth-watering:1.2), professional lighting, detailed texture',
  'Abstract': 'abstract art, (vivid colors:1.2), artistic composition, creative',
};
const AGE_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Young Adult (20s)': '(young adult:1.1), 20s',
  'Middle Aged': 'middle aged, 35-45 years old',
  'Mature': 'mature appearance, 50s',
  'Elderly': 'elderly, wise features, aged gracefully',
  'Teen (AI Safe)': 'teenager, youthful, (school uniform:1.1)',
};
const ETHNICITY_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'East Asian': '(East Asian features:1.2), Korean, Japanese',
  'South Asian': 'South Asian features, Indian, Pakistani',
  'Caucasian': 'Caucasian features, European',
  'African': 'African features, dark skin, (beautiful dark complexion:1.1)',
  'Latin': 'Latin features, warm skin tone',
  'Middle Eastern': 'Middle Eastern features, warm complexion',
  'Mixed': 'mixed ethnicity, diverse features',
};
const HAIR_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Long Black': '(long black hair:1.2), silky hair',
  'Short Brown': 'short brown hair, natural style',
  'Blonde Wavy': '(wavy blonde hair:1.2), golden highlights',
  'Red Curly': '(curly red hair:1.2), vibrant',
  'White/Silver': '(silver white hair:1.2), elegant',
  'Pink Anime': '(pink hair:1.3), anime style',
  'Blue Anime': '(blue hair:1.2), anime style',
  'Bun / Updo': 'hair bun, elegant updo style',
  'Hijab': '(hijab:1.3), (headscarf:1.2), modest',
};
const EXPRESSION_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Neutral / Calm': 'neutral expression, calm, composed',
  'Smiling': '(warm smile:1.2), happy, cheerful',
  'Laughing': '(laughing:1.2), joyful expression',
  'Serious': 'serious expression, determined look',
  'Shy / Blushing': '(shy:1.1), slight blush, timid expression',
  'Confident': 'confident expression, strong gaze',
  'Sad / Emotional': 'melancholic expression, emotional, teary eyes',
  'Surprised': 'surprised expression, wide eyes',
};
const CLOTHING_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Casual Wear': 'casual outfit, jeans, t-shirt, everyday clothing',
  'Formal Business': '(business suit:1.2), formal attire, professional',
  'Traditional (Eastern)': '(traditional clothing:1.2), shalwar kameez, cultural dress',
  'Kimono': '(kimono:1.3), traditional Japanese, elegant',
  'School Uniform': '(school uniform:1.2), blazer, tie',
  'Fantasy Armor': '(detailed armor:1.3), fantasy warrior, intricate design',
  'Military Tactical': '(tactical gear:1.2), military uniform, realistic',
  'Streetwear': 'streetwear fashion, hoodie, sneakers, urban style',
  'Traditional Hijab': '(hijab:1.3), modest Islamic clothing, abaya',
};
const ENVIRONMENT_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Studio / Clean BG': 'studio background, clean backdrop, professional',
  'Natural Outdoor': 'outdoor setting, nature, trees, natural environment',
  'Urban Street': 'city street, urban environment, buildings',
  'Cafe / Indoor': 'cozy cafe, indoor, warm lighting, bokeh background',
  'Fantasy World': 'magical fantasy world, enchanted forest, mystical',
  'Cyberpunk City': 'neon-lit cyberpunk city, rain, futuristic',
  'Japanese Street': 'Japanese alley, lanterns, cherry blossoms, Tokyo vibes',
  'Beach / Ocean': 'beach setting, ocean waves, golden hour, sand',
  'Mountains / Snow': 'mountain landscape, snow, dramatic peaks',
  'Dark / Moody': 'dark moody atmosphere, fog, mysterious',
};
const LIGHTING_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Soft Natural': '(soft natural lighting:1.2), golden hour, warm',
  'Studio Softbox': '(studio lighting:1.2), softbox, professional, even lighting',
  'Golden Hour': '(golden hour:1.3), warm sunset light, cinematic',
  'Blue Hour': 'blue hour, cool tones, twilight, atmospheric',
  'Dramatic Side': '(dramatic lighting:1.2), side lighting, chiaroscuro',
  'Neon / Cyberpunk': '(neon lighting:1.3), colorful, cyberpunk vibes',
  'Candlelight': 'candlelight, warm flickering light, intimate',
  'Overcast / Soft': 'overcast sky, diffused lighting, soft shadows',
  'Backlight / Rim': 'backlit, rim lighting, silhouette effect',
};
const CAMERA_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Portrait (85mm)': '(85mm lens:1.2), f/1.4, shallow depth of field, portrait',
  'Wide Cinematic': '(24mm lens:1.1), wide angle, cinematic',
  'Macro Detail': '(macro photography:1.2), extreme detail, close-up',
  'Telephoto (200mm)': '200mm telephoto, compressed perspective, sports',
  'Street (35mm)': '35mm street photography, natural perspective',
  'Fish-Eye': 'fisheye lens, 180 degree, distorted wide',
  'Low Angle': 'low angle shot, worm eye view, dramatic',
  'Birds Eye': 'birds eye view, top down, overhead shot',
  'Close-Up Face': '(close up face:1.2), facial details, sharp eyes',
};
const MOOD_OPTIONS: Record<string, string> = {
  'Not Specified': '',
  'Dreamy / Soft': '(dreamy:1.2), soft pastel tones, hazy atmosphere, romantic',
  'Dark & Gritty': '(gritty:1.2), dark tones, harsh shadows, raw',
  'Warm & Cozy': 'warm tones, cozy atmosphere, inviting',
  'Cold & Lonely': 'cold blue tones, lonely atmosphere, melancholic',
  'Epic / Heroic': '(epic:1.2), heroic atmosphere, cinematic grandeur',
  'Ethereal / Magical': '(ethereal:1.2), magical atmosphere, glowing, mystical',
  'Vintage / Retro': 'vintage aesthetic, retro color grading, film look',
  'Horror / Eerie': '(eerie:1.2), horror atmosphere, unsettling, dark',
};
const QUALITY_BOOSTERS: Record<string, string> = {
  absolute_qnn: '(sharp focus:1.2), (film grain:0.8), intricate details',
  hyperspire: '(cinematic:1.2), (ultra sharp:1.2), professional',
  realisian: '(skin pores:1.1), (subsurface scattering:1.1), natural',
  anything_v5: '(detailed linework:1.2), (vibrant colors:1.1), illustration quality',
  absolute_cpu: '(sharp focus:1.2), intricate details, high resolution',
  yukimix: '(kawaii:1.1), (soft cel shading:1.2), clean lines',
  chillout: '(detailed skin texture:1.1), (natural beauty:1.2), photorealistic face',
};
// ─── STYLE PRESETS ────────────────────────────────────────────────────────────
const STYLE_PRESETS = [
  {
    name: 'Cinematic Portrait',
    icon: '🎬',
    desc: 'Hollywood-grade dramatic portrait',
    subject: 'Woman Portrait',
    hair: 'Long Black',
    expression: 'Neutral / Calm',
    lighting: 'Dramatic Side',
    camera: 'Portrait (85mm)',
    env: 'Studio / Clean BG',
    mood: 'Dark & Gritty',
    extra: '(cinematic color grade:1.2), film look, anamorphic',
  },
  {
    name: 'K-Drama Aesthetic',
    icon: '🌸',
    desc: 'Soft Korean drama visual style',
    subject: 'Woman Portrait',
    ethnicity: 'East Asian',
    hair: 'Long Black',
    expression: 'Shy / Blushing',
    clothing: 'Casual Wear',
    lighting: 'Soft Natural',
    env: 'Cafe / Indoor',
    mood: 'Dreamy / Soft',
    extra: '(Korean drama style:1.2), soft pastel tones, dreamy',
  },
  {
    name: 'Anime Waifu',
    icon: '🌺',
    desc: 'Vibrant anime key visual style',
    subject: 'Anime Girl',
    hair: 'Pink Anime',
    expression: 'Smiling',
    clothing: 'School Uniform',
    lighting: 'Soft Natural',
    env: 'Natural Outdoor',
    mood: 'Dreamy / Soft',
    extra: '(anime key visual:1.3), vibrant, detailed eyes',
  },
  {
    name: 'Dark Fantasy Warrior',
    icon: '⚔️',
    desc: 'Epic battle-worn fantasy character',
    subject: 'Woman Portrait',
    hair: 'White/Silver',
    expression: 'Serious',
    clothing: 'Fantasy Armor',
    lighting: 'Dramatic Side',
    env: 'Dark / Moody',
    mood: 'Epic / Heroic',
    extra: '(epic fantasy:1.2), dramatic, battle-worn, detailed armor',
  },
  {
    name: 'Street Photography',
    icon: '🌆',
    desc: 'Candid authentic urban moment',
    subject: 'Man Portrait',
    clothing: 'Streetwear',
    lighting: 'Golden Hour',
    env: 'Urban Street',
    camera: 'Street (35mm)',
    mood: 'Warm & Cozy',
    extra: '(street photography:1.2), authentic, candid feeling',
  },
  {
    name: 'Traditional Pakistani',
    icon: '🌙',
    desc: 'Elegant cultural modest beauty',
    subject: 'Woman Portrait',
    ethnicity: 'South Asian',
    hair: 'Hijab',
    clothing: 'Traditional Hijab',
    lighting: 'Soft Natural',
    env: 'Natural Outdoor',
    mood: 'Warm & Cozy',
    extra: '(traditional beauty:1.2), cultural, elegant, modest',
  },
  {
    name: 'Cyberpunk Neon',
    icon: '⚡',
    desc: 'Futuristic rain-soaked neon city',
    subject: 'Woman Portrait',
    hair: 'Blue Anime',
    clothing: 'Streetwear',
    lighting: 'Neon / Cyberpunk',
    env: 'Cyberpunk City',
    mood: 'Cold & Lonely',
    extra: '(cyberpunk aesthetic:1.3), neon reflections, futuristic, rain',
  },
  {
    name: 'Nature Landscape',
    icon: '🏔️',
    desc: 'National Geographic epic scenery',
    subject: 'Landscape',
    lighting: 'Golden Hour',
    env: 'Mountains / Snow',
    camera: 'Wide Cinematic',
    mood: 'Epic / Heroic',
    extra: '(breathtaking:1.2), (epic landscape:1.2), national geographic quality',
  },
  {
    name: 'Ethereal Goddess',
    icon: '✨',
    desc: 'Magical glowing mystical portrait',
    subject: 'Woman Portrait',
    hair: 'White/Silver',
    expression: 'Neutral / Calm',
    lighting: 'Backlight / Rim',
    env: 'Fantasy World',
    mood: 'Ethereal / Magical',
    extra: '(glowing skin:1.2), ethereal, magical aura, goddess',
  },
  {
    name: 'Vintage Film',
    icon: '📷',
    desc: 'Classic retro film photography',
    subject: 'Woman Portrait',
    hair: 'Blonde Wavy',
    expression: 'Smiling',
    lighting: 'Golden Hour',
    env: 'Natural Outdoor',
    camera: 'Street (35mm)',
    mood: 'Vintage / Retro',
    extra: '(vintage film:1.2), grain, Kodak Portra 400, warm tones',
  },
  {
    name: 'Food Portrait',
    icon: '🍜',
    desc: 'Mouth-watering culinary photography',
    subject: 'Food',
    lighting: 'Studio Softbox',
    camera: 'Macro Detail',
    mood: 'Warm & Cozy',
    extra: '(food photography:1.4), steam, glistening, restaurant quality',
  },
  {
    name: 'Chibi Kawaii',
    icon: '🎀',
    desc: 'Super cute chibi anime style',
    subject: 'Anime Girl',
    hair: 'Pink Anime',
    expression: 'Smiling',
    clothing: 'Casual Wear',
    lighting: 'Soft Natural',
    env: 'Natural Outdoor',
    mood: 'Dreamy / Soft',
    extra: '(chibi:1.3), (kawaii:1.2), oversized head, cute proportions',
  },
];
// ─── GUIDE DATA ───────────────────────────────────────────────────────────────
const GUIDE_EN = [
  {
    icon: '🧠',
    title: 'How This Tool Works',
    content: 'Built specifically for LocalDream on Snapdragon 8 Gen 2. Generates properly weighted SD 1.5 prompts for your 7 installed models. Each model has its own optimized prefix, negative prompt, and recommended CFG/Steps settings.',
  },
  {
    icon: '⚖️',
    title: 'Understanding Prompt Weights',
    content: null,
    weights: [
      { tag: '(term:1.4)', desc: 'Very strong emphasis — use sparingly' },
      { tag: '(term:1.2)', desc: 'Moderate emphasis — most common' },
      { tag: '(term:1.0)', desc: 'Normal weight — same as no brackets' },
      { tag: '(term:0.8)', desc: 'De-emphasize — reduce influence' },
      { tag: '((term))', desc: 'Legacy double bracket — equals ~1.1' },
    ],
    warning: '⚠️ Keep weights between 0.5–1.5. Beyond 1.5 causes distortion.',
  },
  {
    icon: '🚀',
    title: 'Pro Tips for Mobile NPU',
    tips: [
      'Keep prompts under 75 tokens for best NPU performance',
      'Start at 512×512, then img2img at 0.8 denoise to upscale',
      'Clip Skip should always be set to 2 for these models',
      'QNN models (NPU) are much faster but slightly less flexible than CPU',
      'Bad face? Add (detailed face:1.3), (symmetrical face:1.2)',
      'Bad hands? Add (perfect hands:1.2), (detailed fingers:1.1)',
      'Use DPM++ 2M Karras sampler for best quality/speed balance',
      'Seed lock a good result before tweaking prompts further',
    ],
  },
];
const GUIDE_UR = [
  {
    icon: '🧠',
    title: 'یہ ٹول کیسے کام کرتا ہے',
    content: 'Snapdragon 8 Gen 2 پر LocalDream ایپ کے لیے خاص طور پر بنایا گیا۔ آپ کے 7 انسٹالڈ ماڈلز کے لیے صحیح weighted SD 1.5 پرامپٹس بناتا ہے۔ ہر ماڈل کا اپنا optimized prefix، negative prompt اور CFG/Steps ہیں۔',
  },
  {
    icon: '⚖️',
    title: 'پرامپٹ ویٹس کو سمجھیں',
    content: null,
    weights: [
      { tag: '(term:1.4)', desc: 'بہت زیادہ زور — کم استعمال کریں' },
      { tag: '(term:1.2)', desc: 'درمیانہ زور — سب سے عام' },
      { tag: '(term:1.0)', desc: 'معمول — بریکٹ کے بغیر جیسا' },
      { tag: '(term:0.8)', desc: 'کم اہمیت دیں' },
      { tag: '((term))', desc: 'پرانا طریقہ — تقریباً 1.1 کے برابر' },
    ],
    warning: '⚠️ ویٹ 0.5 سے 1.5 کے درمیان رکھیں۔ زیادہ سے تصویر خراب ہو سکتی ہے۔',
  },
  {
    icon: '🚀',
    title: 'موبائل NPU کے لیے پرو ٹپس',
    tips: [
      'بہترین NPU پرفارمنس کے لیے پرامپٹ 75 ٹوکن سے کم رکھیں',
      '512×512 سے شروع کریں، پھر img2img میں 0.8 denoise سے upscale کریں',
      'تمام ماڈلز کے لیے Clip Skip کو 2 پر رکھیں',
      'QNN ماڈلز (NPU) تیز ہیں مگر CPU سے تھوڑے کم flexible ہیں',
      'چہرہ غلط لگے تو (detailed face:1.3), (symmetrical face:1.2) شامل کریں',
      'ہاتھ خراب ہوں تو (perfect hands:1.2), (detailed fingers:1.1) استعمال کریں',
      'بہترین نتائج کے لیے DPM++ 2M Karras sampler استعمال کریں',
      'اچھا نتیجہ ملے تو Seed lock کریں پھر پرامپٹ تبدیل کریں',
    ],
  },
];
// ─── UTILITY ──────────────────────────────────────────────────────────────────
function countTokens(text: string) {
  return text.split(',').filter(t => t.trim().length > 0).length;
}
function uid() {
  return Math.random().toString(36).slice(2, 9);
}
// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[8px] font-black px-1.5 py-0.5 rounded-full text-white uppercase tracking-wider"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
interface SelectFieldProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: Record<string, string>;
  accent?: string;
}
function SelectField({ label, icon, value, onChange, options, accent = '#c5a059' }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-70"
        style={{ color: accent }}>
        {icon && <span className="w-3 h-3">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 text-[11px] font-medium outline-none cursor-pointer appearance-none pr-7 transition-all border"
          style={{
            background: 'rgba(0,0,0,0.25)',
            borderColor: 'rgba(197,160,89,0.2)',
            color: 'inherit',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = accent)}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(197,160,89,0.2)')}
        >
          {Object.keys(options).map(opt => (
            <option key={opt} value={opt} style={{ background: '#1a1a2e', color: '#e2e8f0' }}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
          style={{ color: accent }} />
      </div>
    </div>
  );
}
// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
interface PromptGeneratorProps {
  onClose?: () => void;
  standalone?: boolean;
}
export default function PromptGenerator({ onClose, standalone = false }: PromptGeneratorProps) {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    if (standalone) {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark, standalone]);
  // ── Core state ─────────────────────────────────────────────────────────────
  const [selectedModel, setSelectedModel] = useState<ModelKey>('absolute_qnn');
  const [subject, setSubject] = useState('Woman Portrait');
  const [age, setAge] = useState('Not Specified');
  const [ethnicity, setEthnicity] = useState('Not Specified');
  const [hair, setHair] = useState('Long Black');
  const [expression, setExpression] = useState('Neutral / Calm');
  const [clothing, setClothing] = useState('Not Specified');
  const [environment, setEnvironment] = useState('Studio / Clean BG');
  const [lighting, setLighting] = useState('Soft Natural');
  const [camera, setCamera] = useState('Portrait (85mm)');
  const [mood, setMood] = useState('Not Specified');
  const [extraTags, setExtraTags] = useState('');
  const [customNegative, setCustomNegative] = useState('');
  // ── Output state ───────────────────────────────────────────────────────────
  const [positiveOutput, setPositiveOutput] = useState('');
  const [negativeOutput, setNegativeOutput] = useState('');
  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [showNeg, setShowNeg] = useState(true);
  // ── UI state ───────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'warn' } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [guideLang, setGuideLang] = useState<'en' | 'ur'>('en');
  const [activeTab, setActiveTab] = useState<'build' | 'presets' | 'history'>('build');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cfg, setCfg] = useState(7);
  const [steps, setSteps] = useState(25);
  const [showSettings, setShowSettings] = useState(false);
  const [highlightTokens, setHighlightTokens] = useState(false);
  const [presetSearch, setPresetSearch] = useState('');
  const [historyLabel, setHistoryLabel] = useState('');
  const model = MODELS[selectedModel];
  const tokenWarning = tokenCount > 65;
  const tokenDanger = tokenCount > 90;
  // Sync CFG/Steps when model changes
  useEffect(() => {
    setCfg(Math.round((model.cfgRange[0] + model.cfgRange[1]) / 2));
    setSteps(Math.round((model.steps[0] + model.steps[1]) / 2));
  }, [selectedModel]);
  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);
  // ── Compile Prompt ─────────────────────────────────────────────────────────
  const compilePrompt = useCallback(() => {
    const m = MODELS[selectedModel];
    const parts: string[] = [];
    parts.push(m.prefix);
    if (SUBJECT_OPTIONS[subject]) parts.push(SUBJECT_OPTIONS[subject]);
    if (AGE_OPTIONS[age]) parts.push(AGE_OPTIONS[age]);
    if (ETHNICITY_OPTIONS[ethnicity]) parts.push(ETHNICITY_OPTIONS[ethnicity]);
    if (HAIR_OPTIONS[hair]) parts.push(HAIR_OPTIONS[hair]);
    if (EXPRESSION_OPTIONS[expression]) parts.push(EXPRESSION_OPTIONS[expression]);
    if (CLOTHING_OPTIONS[clothing]) parts.push(CLOTHING_OPTIONS[clothing]);
    if (ENVIRONMENT_OPTIONS[environment]) parts.push(ENVIRONMENT_OPTIONS[environment]);
    if (LIGHTING_OPTIONS[lighting]) parts.push(LIGHTING_OPTIONS[lighting]);
    if (CAMERA_OPTIONS[camera]) parts.push(CAMERA_OPTIONS[camera]);
    if (MOOD_OPTIONS[mood]) parts.push(MOOD_OPTIONS[mood]);
    parts.push(QUALITY_BOOSTERS[selectedModel]);
    if (extraTags.trim()) parts.push(extraTags.trim());
    const positive = parts.filter(Boolean).join(', ');
    const negative = customNegative.trim()
      ? `${m.negative}, ${customNegative.trim()}`
      : m.negative;
    setPositiveOutput(positive);
    setNegativeOutput(negative);
    const tc = countTokens(positive);
    setTokenCount(tc);
    // Add to history
    const entry: HistoryEntry = {
      id: uid(),
      model: m.name,
      positive,
      negative,
      tokens: tc,
      timestamp: new Date(),
    };
    setHistory(prev => [entry, ...prev.slice(0, 19)]);
    if (tc > 90) showToast(`⚠️ ${tc} tokens — very long prompt!`, 'warn');
    else if (tc > 65) showToast(`✅ Prompt compiled (~${tc} tokens, getting long)`, 'info');
    else showToast(`✅ Prompt compiled! (~${tc} tokens)`, 'success');
  }, [selectedModel, subject, age, ethnicity, hair, expression, clothing, environment, lighting, camera, mood, extraTags, customNegative, showToast]);
  // ── Randomize ──────────────────────────────────────────────────────────────
  const randomize = useCallback(() => {
    const pick = (obj: Record<string, string>) => {
      const keys = Object.keys(obj);
      return keys[Math.floor(Math.random() * keys.length)];
    };
    const modelKeys = Object.keys(MODELS) as ModelKey[];
    setSelectedModel(modelKeys[Math.floor(Math.random() * modelKeys.length)]);
    setSubject(pick(SUBJECT_OPTIONS));
    setAge(pick(AGE_OPTIONS));
    setEthnicity(pick(ETHNICITY_OPTIONS));
    setHair(pick(HAIR_OPTIONS));
    setExpression(pick(EXPRESSION_OPTIONS));
    setClothing(pick(CLOTHING_OPTIONS));
    setEnvironment(pick(ENVIRONMENT_OPTIONS));
    setLighting(pick(LIGHTING_OPTIONS));
    setCamera(pick(CAMERA_OPTIONS));
    setMood(pick(MOOD_OPTIONS));
    showToast('🎲 Fully randomized!', 'info');
  }, [showToast]);
  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetAll = useCallback(() => {
    setSubject('Woman Portrait');
    setAge('Not Specified');
    setEthnicity('Not Specified');
    setHair('Not Specified');
    setExpression('Not Specified');
    setClothing('Not Specified');
    setEnvironment('Not Specified');
    setLighting('Not Specified');
    setCamera('Not Specified');
    setMood('Not Specified');
    setExtraTags('');
    setCustomNegative('');
    setPositiveOutput('');
    setNegativeOutput('');
    setTokenCount(0);
    showToast('🔄 All fields reset', 'info');
  }, [showToast]);
  // ── Apply Preset ───────────────────────────────────────────────────────────
  const applyPreset = useCallback((preset: typeof STYLE_PRESETS[0]) => {
    if (preset.subject) setSubject(preset.subject);
    if ((preset as any).ethnicity) setEthnicity((preset as any).ethnicity);
    if (preset.hair) setHair(preset.hair);
    if (preset.expression) setExpression(preset.expression);
    if (preset.clothing) setClothing(preset.clothing);
    if (preset.env) setEnvironment(preset.env);
    if (preset.lighting) setLighting(preset.lighting);
    if (preset.camera) setCamera(preset.camera);
    if (preset.mood) setMood(preset.mood);
    if (preset.extra) setExtraTags(preset.extra);
    setActiveTab('build');
    showToast(`✨ "${preset.name}" applied!`, 'success');
  }, [showToast]);
  // ── Copy ───────────────────────────────────────────────────────────────────
  const copyPositive = useCallback(() => {
    navigator.clipboard.writeText(positiveOutput);
    setCopiedPos(true);
    setTimeout(() => setCopiedPos(false), 1800);
  }, [positiveOutput]);
  const copyNegative = useCallback(() => {
    navigator.clipboard.writeText(negativeOutput);
    setCopiedNeg(true);
    setTimeout(() => setCopiedNeg(false), 1800);
  }, [negativeOutput]);
  // ── Download ───────────────────────────────────────────────────────────────
  const downloadPrompt = useCallback(() => {
    if (!positiveOutput) return;
    const content = [
      `=== PROMPT MATRIX — ${model.name} ===`,
      `Generated: ${new Date().toLocaleString()}`,
      `Tokens: ~${tokenCount}`,
      '',
      `[POSITIVE]`,
      positiveOutput,
      '',
      `[NEGATIVE]`,
      negativeOutput,
      '',
      `[SETTINGS]`,
      `CFG Scale: ${cfg}`,
      `Steps: ${steps}`,
      `Clip Skip: ${model.clipSkip}`,
      `Sampler: ${model.sampler}`,
      `Resolution: 512×512`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-matrix-${selectedModel}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Prompt downloaded!', 'success');
  }, [positiveOutput, negativeOutput, model, tokenCount, cfg, steps, selectedModel, showToast]);
  // ── Restore from history ───────────────────────────────────────────────────
  const restoreHistory = useCallback((entry: HistoryEntry) => {
    setPositiveOutput(entry.positive);
    setNegativeOutput(entry.negative);
    setTokenCount(entry.tokens);
    setActiveTab('build');
    showToast('📜 History entry restored', 'info');
  }, [showToast]);
  // ── Highlight tokens toggle ────────────────────────────────────────────────
  function renderHighlighted(text: string) {
    if (!highlightTokens) return <span>{text}</span>;
    const parts = text.split(/,\s*/);
    return (
      <>
        {parts.map((part, i) => {
          const hasWeight = /\(\s*[^:]+:\d+\.?\d*\s*\)/.test(part);
          const isDouble = /\(\([^)]+\)\)/.test(part);
          return (
            <span key={i}>
              <span
                className="rounded px-0.5 transition-colors"
                style={{
                  background: hasWeight
                    ? 'rgba(197,160,89,0.2)'
                    : isDouble
                    ? 'rgba(139,92,246,0.2)'
                    : 'transparent',
                  color: hasWeight ? '#c5a059' : isDouble ? '#a78bfa' : 'inherit',
                }}
              >
                {part}
              </span>
              {i < parts.length - 1 && <span className="opacity-40">, </span>}
            </span>
          );
        })}
      </>
    );
  }
  const filteredPresets = STYLE_PRESETS.filter(p =>
    p.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
    p.desc.toLowerCase().includes(presetSearch.toLowerCase())
  );
  const guideData = guideLang === 'en' ? GUIDE_EN : GUIDE_UR;
  // ── Toast color ────────────────────────────────────────────────────────────
  const toastBg = toast?.type === 'warn'
    ? 'bg-amber-500'
    : toast?.type === 'info'
    ? 'bg-blue-500'
    : 'bg-[#c5a059]';
  // ── Token color ────────────────────────────────────────────────────────────
  const tokenColor = tokenDanger ? '#ef4444' : tokenWarning ? '#f59e0b' : '#22c55e';
  // ── Wrapper classes (standalone vs modal) ──────────────────────────────────
  const wrapperClass = standalone
    ? 'fixed inset-0 z-0 flex items-center justify-center p-2 sm:p-4'
    : 'fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 lg:p-6';
  return (
    <div className={wrapperClass} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Backdrop */}
      {!standalone && (
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        />
      )}
      {/* Background for standalone */}
      {standalone && (
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at 20% 50%, #0d1f18 0%, #061a14 40%, #030d0a 100%)'
              : 'radial-gradient(ellipse at 20% 50%, #f0f7ee 0%, #e8f5e3 40%, #dff0d8 100%)',
          }}
        />
      )}
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[300] ${toastBg} text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transition-all`}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toast.msg}</span>
        </div>
      )}
      {/* ── MAIN PANEL ─────────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-7xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          height: standalone ? '100vh' : '94vh',
          maxHeight: standalone ? '100vh' : '94vh',
          background: isDark
            ? 'linear-gradient(135deg, #0a1f16 0%, #061a14 50%, #080f0c 100%)'
            : 'linear-gradient(135deg, #f8faf6 0%, #f0f7ee 50%, #eaf4e6 100%)',
          border: '1px solid rgba(197,160,89,0.3)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(197,160,89,0.2)',
          color: isDark ? '#e2e8f0' : '#1a2e1a',
        }}
      >
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <div
          className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b"
          style={{
            borderColor: 'rgba(197,160,89,0.2)',
            background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #c5a059, #8a6a2a)' }}
            >
              <Wand2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-lg sm:text-xl font-black uppercase tracking-tight italic"
                  style={{ color: '#c5a059' }}
                >
                  Prompt Matrix
                </h2>
                <span
                  className="hidden sm:inline text-[9px] font-black px-2 py-0.5 rounded-full border"
                  style={{ borderColor: 'rgba(197,160,89,0.3)', color: '#c5a059' }}
                >
                  v2.0
                </span>
              </div>
              <p
                className="text-[9px] font-mono tracking-widest uppercase"
                style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}
              >
                LocalDream · SD 1.5 · 7 Models
              </p>
            </div>
          </div>
          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(p => !p)}
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl border transition-all hover:opacity-80"
              style={{
                background: 'rgba(197,160,89,0.08)',
                borderColor: 'rgba(197,160,89,0.25)',
                color: '#c5a059',
              }}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            {/* Randomize */}
            <button
              onClick={randomize}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:opacity-80"
              style={{
                background: 'rgba(197,160,89,0.08)',
                borderColor: 'rgba(197,160,89,0.25)',
                color: '#c5a059',
              }}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Randomize</span>
            </button>
            {/* Reset */}
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:opacity-80"
              style={{
                background: 'rgba(239,68,68,0.08)',
                borderColor: 'rgba(239,68,68,0.25)',
                color: '#ef4444',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            {/* Guide */}
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:opacity-80"
              style={{
                background: 'rgba(197,160,89,0.08)',
                borderColor: 'rgba(197,160,89,0.25)',
                color: '#c5a059',
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guide</span>
            </button>
            {/* Dark mode (standalone) */}
            {standalone && (
              <button
                onClick={() => setIsDark(p => !p)}
                className="p-2 rounded-xl border transition-all hover:opacity-80"
                style={{
                  background: 'rgba(197,160,89,0.08)',
                  borderColor: 'rgba(197,160,89,0.25)',
                  color: '#c5a059',
                }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            {/* Close */}
            {onClose && !standalone && (
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-all hover:opacity-80"
                style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        {/* ── BODY ─────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">
          {/* ── LEFT SIDEBAR: Model Selector ──────────────────────────────── */}
          {sidebarOpen && (
            <div
              className="hidden lg:flex flex-col w-64 shrink-0 border-r overflow-y-auto"
              style={{
                borderColor: 'rgba(197,160,89,0.12)',
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
              }}
            >
              {/* Model list */}
              <div className="p-4 space-y-1.5">
                <p
                  className="text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5"
                  style={{ color: '#c5a059' }}
                >
                  <Layers className="w-3 h-3" /> Select Model
                </p>
                {(Object.keys(MODELS) as ModelKey[]).map(key => {
                  const m = MODELS[key];
                  const active = selectedModel === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedModel(key)}
                      className="w-full text-left px-3 py-3 rounded-xl border transition-all group"
                      style={{
                        borderColor: active ? m.accentColor : 'transparent',
                        background: active
                          ? `${m.accentColor}12`
                          : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      }}
                      onMouseEnter={e => {
                        if (!active) e.currentTarget.style.borderColor = 'rgba(197,160,89,0.2)';
                      }}
                      onMouseLeave={e => {
                        if (!active) e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-[11px] font-bold truncate pr-1"
                          style={{ color: active ? m.accentColor : isDark ? '#cbd5e1' : '#374151' }}
                        >
                          {m.name}
                        </span>
                        <Badge label={m.badge} color={m.accentColor} />
                      </div>
                      <p
                        className="text-[9px] mb-2"
                        style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}
                      >
                        CFG {m.cfgRange[0]}–{m.cfgRange[1]} · Steps {m.steps[0]}–{m.steps[1]}
                      </p>
                      {active && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            <span>Quality</span><span>{m.strength}%</span>
                          </div>
                          <StatBar value={m.strength} color={m.accentColor} />
                          <div className="flex justify-between text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            <span>Speed</span><span>{m.speed}%</span>
                          </div>
                          <StatBar value={m.speed} color={m.accentColor} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Divider */}
              <div className="mx-4 border-t" style={{ borderColor: 'rgba(197,160,89,0.1)' }} />
              {/* Model tip */}
              <div className="p-4 space-y-3">
                <div
                  className="p-3 rounded-xl border space-y-2"
                  style={{
                    borderColor: 'rgba(197,160,89,0.15)',
                    background: 'rgba(197,160,89,0.04)',
                  }}
                >
                  <div className="flex gap-1.5 items-start">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#c5a059' }} />
                    <p
                      className="text-[9px] leading-relaxed"
                      style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
                    >
                      {model.tip}
                    </p>
                  </div>
                </div>
                {/* Settings */}
                <button
                  onClick={() => setShowSettings(p => !p)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all"
                  style={{
                    borderColor: 'rgba(197,160,89,0.15)',
                    background: showSettings ? 'rgba(197,160,89,0.1)' : 'transparent',
                    color: '#c5a059',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Settings2 className="w-3 h-3" />
                    <span className="text-[9px] uppercase tracking-wider font-black">Settings</span>
                  </div>
                  <ChevronDown
                    className="w-3 h-3 transition-transform"
                    style={{ transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                {showSettings && (
                  <div
                    className="p-3 rounded-xl border space-y-3"
                    style={{
                      borderColor: 'rgba(197,160,89,0.15)',
                      background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {/* CFG */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label
                          className="text-[9px] font-black uppercase tracking-wider"
                          style={{ color: 'rgba(197,160,89,0.7)' }}
                        >
                          CFG Scale
                        </label>
                        <span className="text-[9px] font-mono font-bold" style={{ color: '#c5a059' }}>
                          {cfg}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={20}
                        value={cfg}
                        onChange={e => setCfg(Number(e.target.value))}
                        className="w-full accent-yellow-600 h-1"
                        style={{ accentColor: '#c5a059' }}
                      />
                      <div
                        className="flex justify-between text-[8px]"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        <span>Recommended: {model.cfgRange[0]}–{model.cfgRange[1]}</span>
                      </div>
                    </div>
                    {/* Steps */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label
                          className="text-[9px] font-black uppercase tracking-wider"
                          style={{ color: 'rgba(197,160,89,0.7)' }}
                        >
                          Steps
                        </label>
                        <span className="text-[9px] font-mono font-bold" style={{ color: '#c5a059' }}>
                          {steps}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        value={steps}
                        onChange={e => setSteps(Number(e.target.value))}
                        className="w-full h-1"
                        style={{ accentColor: '#c5a059' }}
                      />
                      <div
                        className="flex justify-between text-[8px]"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        <span>Recommended: {model.steps[0]}–{model.steps[1]}</span>
                      </div>
                    </div>
                    {/* Info row */}
                    <div
                      className="text-[9px] font-mono space-y-0.5 pt-1 border-t"
                      style={{
                        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                        borderColor: 'rgba(197,160,89,0.1)',
                      }}
                    >
                      <p>Clip Skip: {model.clipSkip}</p>
                      <p>Sampler: {model.sampler}</p>
                      <p>Resolution: 512×512</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ── RIGHT: Builder / Presets / History ────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div
              className="shrink-0 flex items-center gap-0 border-b px-4"
              style={{
                borderColor: 'rgba(197,160,89,0.12)',
                background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.25)',
              }}
            >
              {([
                { id: 'build', label: 'Build Prompt', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                { id: 'presets', label: 'Style Presets', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'history', label: `History (${history.length})`, icon: <History className="w-3.5 h-3.5" /> },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold border-b-2 transition-all"
                  style={{
                    borderColor: activeTab === tab.id ? '#c5a059' : 'transparent',
                    color: activeTab === tab.id
                      ? '#c5a059'
                      : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                  }}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
              <div className="flex-1" />
              {/* Highlight toggle */}
              {positiveOutput && activeTab === 'build' && (
                <button
                  onClick={() => setHighlightTokens(p => !p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all mr-2"
                  style={{
                    color: highlightTokens ? '#c5a059' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    background: highlightTokens ? 'rgba(197,160,89,0.1)' : 'transparent',
                  }}
                  title="Highlight weighted tokens"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Highlights</span>
                </button>
              )}
            </div>
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* ── PRESETS TAB ─────────────────────────────────────────── */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={presetSearch}
                      onChange={e => setPresetSearch(e.target.value)}
                      placeholder="Search presets..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                      style={{
                        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
                        borderColor: 'rgba(197,160,89,0.2)',
                        color: 'inherit',
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredPresets.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => applyPreset(preset)}
                        className="p-4 rounded-2xl border text-left transition-all group"
                        style={{
                          borderColor: 'rgba(197,160,89,0.12)',
                          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#c5a059';
                          e.currentTarget.style.background = 'rgba(197,160,89,0.07)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(197,160,89,0.12)';
                          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)';
                        }}
                      >
                        <div className="text-2xl mb-2">{preset.icon}</div>
                        <p
                          className="text-[11px] font-bold leading-tight mb-1 transition-colors group-hover:text-[#c5a059]"
                          style={{ color: isDark ? '#e2e8f0' : '#1a2e1a' }}
                        >
                          {preset.name}
                        </p>
                        <p
                          className="text-[9px] leading-relaxed"
                          style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}
                        >
                          {preset.desc}
                        </p>
                        <div
                          className="mt-2 flex items-center gap-1 text-[9px] font-bold"
                          style={{ color: '#c5a059' }}
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          Apply
                        </div>
                      </button>
                    ))}
                    {filteredPresets.length === 0 && (
                      <div
                        className="col-span-full text-center py-12 text-sm"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        No presets match &ldquo;{presetSearch}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* ── HISTORY TAB ─────────────────────────────────────────── */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div
                      className="text-center py-16"
                      style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }}
                    >
                      <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">No history yet</p>
                      <p className="text-xs mt-1">Generate prompts to see them here</p>
                    </div>
                  ) : (
                    history.map(entry => (
                      <div
                        key={entry.id}
                        className="p-4 rounded-xl border space-y-2"
                        style={{
                          borderColor: 'rgba(197,160,89,0.12)',
                          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-bold"
                              style={{ color: '#c5a059' }}
                            >
                              {entry.model}
                            </span>
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
                              style={{
                                color: tokenColor,
                                background: `${tokenColor}18`,
                              }}
                            >
                              ~{entry.tokens} tokens
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-[9px]"
                              style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
                            >
                              {entry.timestamp.toLocaleTimeString()}
                            </span>
                            <button
                              onClick={() => restoreHistory(entry)}
                              className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg transition-all"
                              style={{
                                color: '#c5a059',
                                background: 'rgba(197,160,89,0.1)',
                              }}
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              Restore
                            </button>
                          </div>
                        </div>
                        <p
                          className="text-[10px] font-mono leading-relaxed line-clamp-2"
                          style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)' }}
                        >
                          {entry.positive}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
              {/* ── BUILD TAB ───────────────────────────────────────────── */}
              {activeTab === 'build' && (
                <>
                  {/* Mobile model selector */}
                  <div className="lg:hidden space-y-1.5">
                    <SelectField
                      label="Model"
                      icon={<Layers className="w-3 h-3" />}
                      value={selectedModel}
                      onChange={v => setSelectedModel(v as ModelKey)}
                      options={Object.fromEntries(
                        Object.keys(MODELS).map(k => [k, MODELS[k as ModelKey].name])
                      )}
                    />
                    <div
                      className="p-2.5 rounded-lg border text-[9px] flex items-start gap-2"
                      style={{
                        borderColor: 'rgba(197,160,89,0.15)',
                        background: 'rgba(197,160,89,0.04)',
                        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                      }}
                    >
                      <Info className="w-3 h-3 shrink-0 mt-0.5 text-yellow-500" />
                      <span>{model.tip}</span>
                    </div>
                  </div>
                  {/* Section label */}
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1" style={{ background: 'rgba(197,160,89,0.12)' }} />
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2"
                      style={{ color: 'rgba(197,160,89,0.5)' }}
                    >
                      Subject & Character
                    </span>
                    <div className="h-px flex-1" style={{ background: 'rgba(197,160,89,0.12)' }} />
                  </div>
                  {/* Grid: Character */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <SelectField
                      label="Subject / Type"
                      icon={<Target className="w-3 h-3" />}
                      value={subject}
                      onChange={setSubject}
                      options={SUBJECT_OPTIONS}
                    />
                    <SelectField
                      label="Age Range"
                      value={age}
                      onChange={setAge}
                      options={AGE_OPTIONS}
                    />
                    <SelectField
                      label="Ethnicity / Look"
                      value={ethnicity}
                      onChange={setEthnicity}
                      options={ETHNICITY_OPTIONS}
                    />
                    <SelectField
                      label="Hair Style"
                      value={hair}
                      onChange={setHair}
                      options={HAIR_OPTIONS}
                    />
                    <SelectField
                      label="Expression"
                      value={expression}
                      onChange={setExpression}
                      options={EXPRESSION_OPTIONS}
                    />
                    <SelectField
                      label="Clothing"
                      value={clothing}
                      onChange={setClothing}
                      options={CLOTHING_OPTIONS}
                    />
                  </div>
                  {/* Section label */}
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1" style={{ background: 'rgba(197,160,89,0.12)' }} />
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2"
                      style={{ color: 'rgba(197,160,89,0.5)' }}
                    >
                      Scene & Atmosphere
                    </span>
                    <div className="h-px flex-1" style={{ background: 'rgba(197,160,89,0.12)' }} />
                  </div>
                  {/* Grid: Scene */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <SelectField
                      label="Environment"
                      icon={<Palette className="w-3 h-3" />}
                      value={environment}
                      onChange={setEnvironment}
                      options={ENVIRONMENT_OPTIONS}
                    />
                    <SelectField
                      label="Lighting"
                      icon={<Sun className="w-3 h-3" />}
                      value={lighting}
                      onChange={setLighting}
                      options={LIGHTING_OPTIONS}
                    />
                    <SelectField
                      label="Camera / Angle"
                      icon={<Camera className="w-3 h-3" />}
                      value={camera}
                      onChange={setCamera}
                      options={CAMERA_OPTIONS}
                    />
                    <SelectField
                      label="Mood / Tone"
                      icon={<Zap className="w-3 h-3" />}
                      value={mood}
                      onChange={setMood}
                      options={MOOD_OPTIONS}
                    />
                  </div>
                  {/* Extra / Custom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        className="text-[9px] font-black uppercase tracking-widest block"
                        style={{ color: 'rgba(197,160,89,0.7)' }}
                      >
                        Extra Tags (optional)
                      </label>
                      <input
                        type="text"
                        value={extraTags}
                        onChange={e => setExtraTags(e.target.value)}
                        placeholder="e.g., (rain:1.2), wet hair, reflections..."
                        className="w-full px-3 py-2.5 rounded-lg border text-[11px] outline-none transition-all"
                        style={{
                          background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)',
                          borderColor: 'rgba(197,160,89,0.2)',
                          color: 'inherit',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#c5a059')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(197,160,89,0.2)')}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="text-[9px] font-black uppercase tracking-widest block"
                        style={{ color: 'rgba(239,68,68,0.7)' }}
                      >
                        Add to Negative (optional)
                      </label>
                      <input
                        type="text"
                        value={customNegative}
                        onChange={e => setCustomNegative(e.target.value)}
                        placeholder="e.g., glasses, beard, hat..."
                        className="w-full px-3 py-2.5 rounded-lg border text-[11px] outline-none transition-all"
                        style={{
                          background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)',
                          borderColor: 'rgba(239,68,68,0.2)',
                          color: 'inherit',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#ef4444')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)')}
                      />
                    </div>
                  </div>
                  {/* Generate Button */}
                  <button
                    onClick={compilePrompt}
                    className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #c5a059 0%, #8a6a2a 100%)',
                      boxShadow: '0 8px 32px rgba(197,160,89,0.3)',
                      color: '#000',
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, #d4b16a 0%, #c5a059 100%)' }}
                    />
                    <Sparkles className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Generate Optimized Prompt</span>
                  </button>
                  {/* Output */}
                  {positiveOutput && (
                    <div className="space-y-3">
                      {/* Warnings */}
                      {(tokenWarning || tokenDanger) && (
                        <div
                          className="flex items-center gap-2 p-3 rounded-xl border"
                          style={{
                            borderColor: tokenDanger ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)',
                            background: tokenDanger ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
                          }}
                        >
                          <AlertCircle
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: tokenDanger ? '#ef4444' : '#f59e0b' }}
                          />
                          <p
                            className="text-[10px] font-medium"
                            style={{ color: tokenDanger ? '#ef4444' : '#f59e0b' }}
                          >
                            {tokenDanger
                              ? `⚠️ ~${tokenCount} tokens — very long! May cause quality issues on NPU.`
                              : `⚠️ ~${tokenCount} tokens — getting long for mobile NPU. Consider trimming.`}
                          </p>
                        </div>
                      )}
                      {/* Section header */}
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1" style={{ background: 'rgba(197,160,89,0.12)' }} />
                        <span
                          className="text-[9px] font-black uppercase tracking-widest px-2 flex items-center gap-1.5"
                          style={{ color: 'rgba(197,160,89,0.5)' }}
                        >
                          <Zap className="w-3 h-3" /> Output
                        </span>
                        <div className="h-px flex-1" style={{ background: 'rgba(197,160,89,0.12)' }} />
                      </div>
                      {/* Positive Prompt */}
                      <div
                        className="rounded-2xl border overflow-hidden"
                        style={{ borderColor: 'rgba(197,160,89,0.2)' }}
                      >
                        <div
                          className="flex items-center justify-between px-4 py-2.5 border-b"
                          style={{
                            borderColor: 'rgba(197,160,89,0.15)',
                            background: isDark ? 'rgba(197,160,89,0.06)' : 'rgba(197,160,89,0.08)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#c5a059' }}>
                              ✅ Positive Prompt
                            </span>
                            <span
                              className="text-[8px] font-mono px-1.5 py-0.5 rounded-full"
                              style={{ background: `${tokenColor}20`, color: tokenColor }}
                            >
                              ~{tokenCount} tokens
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={downloadPrompt}
                              className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg border transition-all"
                              style={{
                                color: '#c5a059',
                                borderColor: 'rgba(197,160,89,0.3)',
                                background: 'rgba(197,160,89,0.05)',
                              }}
                              title="Download as .txt"
                            >
                              <Download className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={copyPositive}
                              className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-lg border transition-all"
                              style={copiedPos
                                ? { background: '#22c55e', color: '#fff', borderColor: '#22c55e' }
                                : { color: '#c5a059', borderColor: 'rgba(197,160,89,0.3)', background: 'rgba(197,160,89,0.05)' }
                              }
                            >
                              {copiedPos ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                            </button>
                          </div>
                        </div>
                        <div
                          className="p-4 text-[11px] font-mono leading-relaxed max-h-32 overflow-y-auto select-all"
                          style={{ color: isDark ? '#94a3b8' : '#374151' }}
                        >
                          {renderHighlighted(positiveOutput)}
                        </div>
                      </div>
                      {/* Negative Prompt */}
                      <div
                        className="rounded-2xl border overflow-hidden"
                        style={{ borderColor: 'rgba(239,68,68,0.2)' }}
                      >
                        <div
                          className="flex items-center justify-between px-4 py-2.5 border-b"
                          style={{
                            borderColor: 'rgba(239,68,68,0.12)',
                            background: isDark ? 'rgba(239,68,68,0.04)' : 'rgba(239,68,68,0.05)',
                          }}
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#ef4444' }}>
                            ❌ Negative Prompt
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setShowNeg(p => !p)}
                              className="p-1 rounded transition-all"
                              style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
                            >
                              {showNeg ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={copyNegative}
                              className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-lg border transition-all"
                              style={copiedNeg
                                ? { background: '#22c55e', color: '#fff', borderColor: '#22c55e' }
                                : { color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }
                              }
                            >
                              {copiedNeg ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                            </button>
                          </div>
                        </div>
                        {showNeg && (
                          <div
                            className="p-4 text-[11px] font-mono leading-relaxed max-h-24 overflow-y-auto select-all"
                            style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}
                          >
                            {negativeOutput}
                          </div>
                        )}
                      </div>
                      {/* Settings summary */}
                      <div
                        className="flex flex-wrap gap-2 text-[9px] font-mono"
                        style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}
                      >
                        {[
                          `CFG: ${cfg}`,
                          `Steps: ${steps}`,
                          `Clip Skip: ${model.clipSkip}`,
                          `Sampler: ${model.sampler}`,
                          `Res: 512×512`,
                        ].map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-lg border"
                            style={{ borderColor: 'rgba(197,160,89,0.12)', background: 'rgba(197,160,89,0.04)' }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {/* ── GUIDE OVERLAY ────────────────────────────────────────────────── */}
        {showGuide && (
          <div
            className="absolute inset-0 z-[120] flex flex-col"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #0a1f16 0%, #061a14 100%)'
                : 'linear-gradient(135deg, #f8faf6 0%, #f0f7ee 100%)',
            }}
          >
            {/* Guide header */}
            <div
              className="shrink-0 flex items-center justify-between px-6 py-4 border-b"
              style={{
                borderColor: 'rgba(197,160,89,0.2)',
                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
              }}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" style={{ color: '#c5a059' }} />
                <h3
                  className="text-lg font-black uppercase tracking-tight"
                  style={{ color: '#c5a059' }}
                >
                  LocalDream Prompt Guide
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {/* Lang switcher */}
                <div
                  className="flex p-1 rounded-xl border"
                  style={{
                    borderColor: 'rgba(197,160,89,0.2)',
                    background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {(['en', 'ur'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setGuideLang(lang)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: guideLang === lang ? '#c5a059' : 'transparent',
                        color: guideLang === lang ? '#000' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      }}
                    >
                      {lang === 'en' ? 'English' : 'اردو'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="p-2 rounded-full transition-all"
                  style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                >
                  <X className="w-5 h-5" style={{ color: isDark ? '#fff' : '#000' }} />
                </button>
              </div>
            </div>
            {/* Guide body */}
            <div
              className="flex-1 overflow-y-auto"
              dir={guideLang === 'ur' ? 'rtl' : 'ltr'}
            >
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {/* Section: guide content */}
                {guideData.map((section, si) => (
                  <section key={si} className="space-y-4">
                    <h4
                      className="text-base font-black flex items-center gap-2"
                      style={{ color: '#c5a059' }}
                    >
                      <span className="text-xl">{section.icon}</span>
                      {section.title}
                    </h4>
                    {section.content && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                      >
                        {section.content}
                      </p>
                    )}
                    {(section as any).weights && (
                      <div
                        className="rounded-xl border overflow-hidden"
                        style={{ borderColor: 'rgba(197,160,89,0.2)' }}
                      >
                        <div className="divide-y" style={{ borderColor: 'rgba(197,160,89,0.1)' }}>
                          {(section as any).weights.map((w: { tag: string; desc: string }, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 px-4 py-3"
                              style={{ background: i % 2 === 0 ? 'rgba(197,160,89,0.03)' : 'transparent' }}
                            >
                              <code
                                className="text-xs font-mono font-bold shrink-0"
                                style={{ color: '#c5a059' }}
                              >
                                {w.tag}
                              </code>
                              <span
                                className="text-xs"
                                style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                              >
                                {w.desc}
                              </span>
                            </div>
                          ))}
                        </div>
                        {(section as any).warning && (
                          <div
                            className="px-4 py-3 flex items-center gap-2 border-t"
                            style={{
                              borderColor: 'rgba(245,158,11,0.2)',
                              background: 'rgba(245,158,11,0.05)',
                            }}
                          >
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                            <span className="text-xs text-amber-400">{(section as any).warning}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {(section as any).tips && (
                      <div className="space-y-2.5">
                        {(section as any).tips.map((tip: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5"
                              style={{ background: '#c5a059', color: '#000' }}
                            >
                              {i + 1}
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                            >
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
                {/* Per-model table */}
                <section className="space-y-4">
                  <h4
                    className="text-base font-black flex items-center gap-2"
                    style={{ color: '#c5a059' }}
                  >
                    <span className="text-xl">📊</span>
                    {guideLang === 'en' ? 'All Models At a Glance' : 'تمام ماڈلز ایک نظر میں'}
                  </h4>
                  <div
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: 'rgba(197,160,89,0.2)' }}
                  >
                    <div
                      className="grid grid-cols-4 gap-0 px-4 py-2 text-[9px] font-black uppercase tracking-wider border-b"
                      style={{
                        color: '#c5a059',
                        borderColor: 'rgba(197,160,89,0.2)',
                        background: 'rgba(197,160,89,0.08)',
                      }}
                    >
                      <span>Model</span>
                      <span>CFG</span>
                      <span>Steps</span>
                      <span>Type</span>
                    </div>
                    {(Object.keys(MODELS) as ModelKey[]).map((key, i) => {
                      const m = MODELS[key];
                      return (
                        <div
                          key={key}
                          className="grid grid-cols-4 gap-0 px-4 py-3 text-xs border-b last:border-b-0"
                          style={{
                            borderColor: 'rgba(197,160,89,0.08)',
                            background: i % 2 === 0 ? 'rgba(197,160,89,0.02)' : 'transparent',
                          }}
                        >
                          <span
                            className="font-bold text-[10px]"
                            style={{ color: m.accentColor }}
                          >
                            {m.name}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                          >
                            {m.cfgRange[0]}–{m.cfgRange[1]}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: isDark ? '#94a3b8' : '#4b5563' }}
                          >
                            {m.steps[0]}–{m.steps[1]}
                          </span>
                          <Badge label={m.badge} color={m.accentColor} />
                        </div>
                      );
                    })}
                  </div>
                </section>
                <div className="h-8" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
