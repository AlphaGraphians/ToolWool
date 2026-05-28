'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, X, BookOpen, Copy, Target, 
  ChevronRight, ChevronLeft, Cpu, Clock, Video, LayoutGrid
} from 'lucide-react';

interface PromptGeneratorProps {
  onClose: () => void;
}

interface MatrixLevel {
  label: string;
  options: Record<string, string>;
}

// --- 1. NPU TARGET CONTEXT PRESETS ---
const NPU_PRESETS: Record<string, { prefix: string; negative: string }> = {
  absolute: {
    prefix: "masterpiece, photorealistic, hyperrealistic raw photo, 8k resolution, highly detailed textures, sharp focus, cinematic lighting, high-end production value, professional photography,",
    negative: "deformed, bad anatomy, bad hands, mutated fingers, extra limbs, digital art, 3d render, cartoon, anime, drawing, illustration, sketch, low quality, blurred, watermark, text, grainy"
  },
  chillout: {
    prefix: "highly realistic asian photo print, professional dslr portraiture, soft skin textures, authentic life-like rendering, masterpiece quality, 8k uhd, sharp iris detail,",
    negative: "anime, vector illustration, painting, drawing, bad face mapping, extra hands, disfigured, cartoonish, low resolution, noisy, bad lighting, multiple people"
  },
  yuki: {
    prefix: "premium stunning anime style illustration art, high-quality Japanese animation aesthetic, clean vector outlines, vibrant cel-shaded mastery, masterpiece visual execution, trending on pixiv,",
    negative: "photorealistic, realistic, real life photo, 3d digital model, real human skin, lowres, distorted anatomy, messy linework, muddy colors, text, signature"
  }
};

// --- 2. NEURAL KEYWORD DICTIONARY ---
const KEYWORD_SCANNER: Record<string, string[]> = {
  "Human": ["man", "woman", "girl", "boy", "person", "model", "face", "portrait", "warrior", "soldier", "lady", "gentleman", "knight", "human", "character"],
  "Animal": ["cat", "dog", "lion", "tiger", "fur", "paws", "wildlife", "bird", "eagle", "animal", "wolf", "horse", "biological creature", "beast"],
  "Architecture": ["building", "skyscraper", "house", "palace", "interior", "room", "temple", "tower", "mall", "office", "urban structure", "facade"],
  "Vehicle": ["car", "truck", "airplane", "ship", "jet", "bike", "motorcycle", "engine", "cockpit", "supercar", "automotive", "spaceship"],
  "Nature": ["mountain", "forest", "tree", "river", "ocean", "grass", "landscape", "jungle", "desert", "waterfall", "flora", "biome", "meadow"],
  "Technology": ["robot", "cyborg", "hardware", "computer", "circuit", "server", "tech", "gadget", "drone", "android", "microchip", "mainframe"]
};

// --- 3. NEURAL DEPENDENCY MATRIX ---
const DEPENDENCY_RULES: Record<string, { target: string; allowOnly: string[]; highlight: string }> = {
  "Close-Up": { target: "category6", allowOnly: ["100mm Macro"], highlight: "100mm Macro" },
  "Wide Angle": { target: "category6", allowOnly: ["14mm Ultra-Wide", "35mm Standard"], highlight: "14mm Ultra-Wide" },
  "Anime": { target: "category2", allowOnly: ["Watercolor", "Oil Painting"], highlight: "Watercolor" },
  "Sci-Fi": { target: "category7", allowOnly: ["Cyberpunk Neon", "Volumetric Sunbeams"], highlight: "Cyberpunk Neon" },
  "Deep Jungle": { target: "category7", allowOnly: ["Volumetric Sunbeams", "Golden Hour"], highlight: "Volumetric Sunbeams" }
};

// --- 4. THE COMPLETE RESTORED MEGA PROMPT MATRIX ---
const PROMPT_MATRIX: Record<string, MatrixLevel> = {
  category0: {
    label: "Level 0: Main Subject Base",
    options: {
      "Human": "highly detailed human features, intricate anatomical structures, realistic organic skin textures with visible pores, lifelike expressions, authentic human presence, masterfully rendered eyes, subsurface scattering on skin, natural muscle definition",
      "Animal": "hyper-detailed fur and coat textures, realistic animal eye glint, authentic biological wildlife features, organic movement physics, intricate feather or scale patterns, majestic animal kingdom presence, accurate anatomy",
      "Architecture": "grand structural architecture, intricate building textures, geometric dimensional balance, hard surface structural detailing, weathering and historical material realism, professional architectural visualization",
      "Vehicle": "aerodynamic mechanical body, polished specular panels, intricate mechanical sub-assemblies, industrial automotive design, realistic metallic reflections, high-performance engineering aesthetic",
      "Nature": "vibrant biological flora, hyper-detailed plant textures, organic environmental growth, realistic terrain features, intricate botanical details, lush natural ecosystem",
      "Food": "mouth-watering culinary presentation, hyper-realistic food textures, steam and heat haze, intricate garnishing details, professional food photography, glistening sauces, fresh organic ingredients, studio lighting",
      "Abstract": "complex mathematical fractals, ethereal light energy flows, surreal geometric distortions, non-representational artistic depth, vibrant color gradients, conceptual visual metaphors, dreamlike atmospheric textures",
      "Technology": "intricate electronic components, sleek hardware aesthetics, advanced circuitry patterns, glowing internal hardware lights, industrial tech design, precision engineering visuals"
    }
  },
  category1: {
    label: "Level 1: Genre & Theme World",
    options: {
      "Sci-Fi": "futuristic technological atmosphere, advanced cybernetic mechanics, high-tech components, neon ambient circuitry grids, sprawling megastructure aesthetics, interstellar science fiction world",
      "Cyberpunk": "gritty high-tech low-life urban aesthetic, rain-slicked neon streets, futuristic metropolitan decay, cybernetic body augmentations, dark atmospheric synthwave vibe, holographic advertisements",
      "Military": "gritty authentic tactical military theme, weathered heavy combat uniforms, tactical loadout gear, professional operative equipment, combat readiness, dust and debris, realistic warfare atmosphere",
      "Fantasy": "enchanting high-fantasy world setting, ancient mythical atmosphere, ethereal magic artifacts, legendary surreal details, sprawling medieval kingdoms, mythical creature habitats",
      "Noir": "classic film noir aesthetic, dramatic high-contrast shadows, mysterious urban atmosphere, rain-drenched city streets, hard-boiled detective style, moody cinematic lighting, 1940s vintage feel",
      "Anime": "vibrant hand-drawn anime key visual aesthetic, clean sharp linework, expressive illustration styles, cel-shaded mastery, high-quality Japanese animation vibe, dynamic manga composition",
      "Historical": "authentic period-accurate setting, rich historical textures, traditional cultural artifacts, vintage era atmosphere, realistic historical costumes, antique world-building"
    }
  },
  category2: {
    label: "Level 2: Visual Style & Medium",
    options: {
      "Cinematic Still": "professional cinematic movie still frame, authentic 35mm film grain emulation, anamorphic cinematic look, masterfully calibrated cinema color grade, high production value, dramatic storytelling atmosphere",
      "National Geographic": "raw documentary photography aesthetic, unedited natural environment capture, crisp realistic textures, true wildlife storytelling depth, authentic national geographic magazine quality",
      "Unreal Engine 5": "high-end next-gen real-time 3D render, ray-traced ambient occlusion, global illumination matrix, hyper-detailed environment sub-surfaces, lumen and nanite technical precision",
      "Oil Painting": "traditional fine art oil on canvas, visible impasto brushstrokes, rich pigment textures, classical painterly composition, masterwork gallery quality, artistic hand-painted depth",
      "Watercolor": "soft delicate watercolor wash, fluid artistic pigment bleeding, traditional paper texture, hand-painted aesthetic, ethereal color blending, artistic minimalism, wet-on-wet technique",
      "Cyber-Surrealism": "merging digital technology with dreamlike surrealism, glitch art elements, distorted reality, vibrant neon-organic hybrids, futuristic artistic abstraction"
    }
  },
  category3: {
    label: "Level 3: Camera Framing & Angle",
    options: {
      "Wide Angle": "expansive wide-angle perspective composition, environmental deep storytelling framing, immersive field of view, sweeping background depth, large scale visualization",
      "Portrait": "close-up shallow depth of field facial portrait, razor-sharp focus on the iris, professional studio background separation, perfect bokeh mapping, intimate character focus",
      "Low Angle Heroic": "dramatic low-angle worm-eye perspective, majestic heroic posture scaling, imposing larger-than-life presentation, powerful cinematic upward view",
      "Close-Up": "tight macro-level framing, focusing on intricate subject details, extreme textural clarity, high-impact visual engagement with specific features",
      "Birds Eye View": "extreme high-angle top-down perspective, sprawling environmental layout, architectural floorplan view, vast structural scale from above, miniature effect",
      "Dutch Angle": "tilted horizon camera canting, uneasy psychological tension, dynamic cinematic movement, experimental framing, artistic perspective shift"
    }
  },
  category4: {
    label: "Level 4: Subject Orientation",
    options: {
      "Front View": "direct head-on symmetrical portraiture, bold eye-contact configuration, centered structural layout engagement, full frontal subject alignment, authoritative presence",
      "Three-Quarter Front": "dynamic three-quarter front angle view, volumetric multidimensional orientation, depth-optimized facial structure alignment, natural and engaging subject positioning",
      "Side Profile": "sharp side profile silhouette, emphasizing facial contours and anatomical outline, elegant lateral perspective, focused side-on view, artistic structural depth",
      "Back View": "mysterious rear perspective, focusing on back detailing, subject looking away into the distance, environmental engagement from behind, silhouette focus from the rear",
      "Top-Down": "exact vertical orientation looking down at the subject, flat lay aesthetic, geometric structural alignment, top-surface detailing focus"
    }
  },
  category5: {
    label: "Level 5: Camera Models & Gear",
    options: {
      "IMAX 70mm": "captured on historical IMAX 70mm large format camera systems, crystal clear premium optical resolution, legendary cinematic grain structure scaling, immersive large-format visual scale",
      "DSLR Professional": "shot with full-frame professional high-end DSLR camera body, pristine glass refraction mechanics, ultimate dynamic range clarity, sharp digital sensor rendering",
      "Vintage Polaroid": "authentic vintage Polaroid instant film aesthetic, soft color bleeding, nostalgic analog grain, chemical development textures, historical retro photography feel",
      "GoPro Action": "wide-angle fish-eye action camera perspective, high-intensity immersive view, rugged outdoor aesthetic, dynamic sports-style framing, slight lens curvature",
      "RED V-Raptor": "high-end digital cinema camera sensor, extreme tonal range, professional movie industry color science, razor-sharp digital crispness"
    }
  },
  category6: {
    label: "Level 6: Lenses & Optics",
    options: {
      "14mm Ultra-Wide": "ultra-wide 14mm prime lens mechanics, dramatic perspective field distortion, immense spatial structural rendering, expansive immersive field of view",
      "85mm Prime": "legendary 85mm f/1.2 portrait prime lens glass, ultra-creamy background blur physics, absolute zero face distortion compression, razor-sharp subject isolation",
      "100mm Macro": "100mm macro specialized lens focus lock, microscopic skin pore and texture detailing, extreme high-fidelity surface audit, shallowest depth of field",
      "Fisheye": "180-degree spherical fisheye lens distortion, extreme curved perspective, immersive wide panoramic view, unique optical aberration",
      "35mm Standard": "natural human-eye perspective, professional street photography look, balanced depth of field, versatile cinematic framing, authentic storytelling lens",
      "600mm Telephoto": "extreme long-range compression, subject appearing close to background, wildlife photography optics, narrow field of view, professional sports lens"
    }
  },
  category7: {
    label: "Level 7: Atmospheric Lighting",
    options: {
      "Golden Hour": "bathed in warm golden hour illumination, long cinematic atmospheric shadows, rich amber highlights, high-contrast evening twilight glow, radiant sunset atmosphere",
      "Cyberpunk Neon": "flooded with dual cyberpunk neon illumination, vibrant hot pink and cyan reflections, misty moody nocturnal city glow tracking, high-contrast saturated color palette",
      "Volumetric Sunbeams": "dramatic volumetric light rays, ethereal sunbeams piercing through atmosphere, dusty light shafts, holy light effect, atmospheric depth and texture",
      "Moody Chiaroscuro": "dramatic high-contrast chiaroscuro lighting, deep mysterious shadows, sharp light-to-dark transitions, classical painterly lighting technique",
      "Soft Studio Light": "professional softbox studio illumination, even light distribution, flattering subject shadows, high-key photography aesthetic, clean commercial look",
      "Moonlight": "ethereal cool-toned nocturnal lighting, pale blue lunar glow, mysterious deep shadows, nighttime atmosphere, calm silver highlights"
    }
  },
  category8: {
    label: "Level 8: Environment Context",
    options: {
      "Deep Jungle": "dense prehistoric untamed tropical jungle canopy, lush ancient foliage patterns, sunbeams piercing through heavy moisture mist sheets, vibrant exotic biodiversity",
      "Cyberpunk Street": "wet rain-slicked futuristic metropolitan back alleyways, glowing holographic billboards, gritty neon urban decay details, industrial steam vents",
      "Abandoned Ruins": "ancient crumbling stone structures, reclaimed by nature with overgrowing vines, mysterious historical echoes, weathered architectural decay, dusty sun-drenched ruins",
      "Snowy Mountains": "majestic snow-capped mountain peaks, treacherous icy terrain, crystalline frost textures, sub-zero atmospheric haze, vast alpine wilderness",
      "Undersea World": "mysterious deep ocean environment, caustic light patterns through water, vibrant coral reefs, floating marine particles, bioluminescent creatures",
      "Outer Space": "infinite cosmic void, distant nebulas and star clusters, planetary orbits, zero-gravity atmosphere, stark high-contrast space lighting"
    }
  },
  category9: {
    label: "Level 9: Artist Signature Influence",
    options: {
      "Greg Rutkowski": "masterfully illustrated by Greg Rutkowski artstyle, epic scale historical fantasy layouts, raw visible oil brushstroke textures, master of dramatic light and shadow",
      "Makoto Shinkai": "inspired by Makoto Shinkai anime masterworks, highly luminous twilight sky gradients, hyper-emotional light bloom, intricate environmental realism",
      "Salvador Dali": "surrealist masterpiece in the style of Salvador Dali, melting objects, dream-logic composition, impossible desert landscapes, bizarre visual metaphors",
      "Vincent van Gogh": "post-impressionist style of Van Gogh, thick swirling brushstrokes, vibrant emotional colors, textured impasto technique, starry night atmosphere",
      "H.R. Giger": "biomechanical aesthetic of H.R. Giger, dark monochromatic textures, fusion of organic and industrial, haunting extraterrestrial designs, intricate metallic-organic forms"
    }
  },
  category10: {
    label: "Level 10: Technical Parameters",
    options: {
      "9:16 Portrait": "--ar 9:16, vertical mobile display orientation, optimized for smartphone screens, high-definition vertical composition",
      "16:9 Widescreen": "--ar 16:9, cinematic widescreen aspect ratio, expansive horizontal framing, movie theater display format",
      "1:1 Square": "--ar 1:1, perfectly symmetrical square composition, balanced social media format, centralized structural focus",
      "Masterpiece Metadata": "masterpiece, best quality, ultra-detailed, 8k, highly intricate, professional award-winning standards, sharp aesthetic precision",
      "Photographic Raw": "raw photo format, unedited digital negative, maximum dynamic range, authentic camera sensor data, no post-processing"
    }
  }
};

export default function PromptGenerator({ onClose }: PromptGeneratorProps) {
  const [modelBias, setModelBias] = useState<string>('absolute');
  const [corePrompt, setCorePrompt] = useState<string>('');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [disabledOptions, setDisabledOptions] = useState<Record<string, string[]>>({});
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [positiveOutput, setPositiveOutput] = useState<string>('Click \'Generate Master Matrix Tokens\' to compile logic...');
  const [negativeOutput, setNegativeOutput] = useState<string>('Anti-artifact matrix ready...');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [guideLang, setGuideLang] = useState<'en' | 'ur'>('en');
  const [toast, setToast] = useState<string | null>(null);

  // --- NEW: THEME TRACKING LOGIC ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check for theme
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    checkTheme();

    // Listen for changes in the document element's classes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const initSelections: Record<string, string> = {};
    Object.keys(PROMPT_MATRIX).forEach(key => {
      initSelections[key] = 'AI';
    });
    setSelections(initSelections);
  }, []);

  useEffect(() => {
    const input = corePrompt.toLowerCase();
    let detectedBase: string | null = null;
    Object.keys(KEYWORD_SCANNER).forEach(category => {
      if (KEYWORD_SCANNER[category].some(keyword => input.includes(keyword))) {
        detectedBase = category;
      }
    });
    if (detectedBase && selections.category0 !== detectedBase) {
      setSelections(prev => ({ ...prev, category0: detectedBase! }));
    }
  }, [corePrompt, selections.category0]);

  useEffect(() => {
    const nextDisabled: Record<string, string[]> = {};
    const nextHighlights: Record<string, string> = {};
    Object.keys(PROMPT_MATRIX).forEach(catKey => {
      const currentVal = selections[catKey];
      if (DEPENDENCY_RULES[currentVal]) {
        const rule = DEPENDENCY_RULES[currentVal];
        const allTargetOptions = Object.keys(PROMPT_MATRIX[rule.target].options);
        const invalidOptions = allTargetOptions.filter(opt => !rule.allowOnly.includes(opt));
        nextDisabled[rule.target] = invalidOptions;
        nextHighlights[rule.target] = rule.highlight;
      }
    });
    setDisabledOptions(nextDisabled);
    setHighlights(nextHighlights);
  }, [selections]);

  const handleDropdownChange = (categoryKey: string, value: string) => {
    setSelections(prev => ({ ...prev, [categoryKey]: value }));
  };

  const compileMasterMatrix = () => {
    const currentPreset = NPU_PRESETS[modelBias];
    let tokens: string[] = [currentPreset.prefix];
    if (corePrompt.trim()) tokens.push(corePrompt.trim());
    Object.keys(PROMPT_MATRIX).forEach(key => {
      const userChoice = selections[key];
      if (userChoice !== 'NONE') {
        if (userChoice === 'AI') {
          const defaultFallback = Object.keys(PROMPT_MATRIX[key].options)[0];
          if (defaultFallback) tokens.push(PROMPT_MATRIX[key].options[defaultFallback]);
        } else {
          const detailedPhrase = PROMPT_MATRIX[key].options[userChoice];
          if (detailedPhrase) tokens.push(detailedPhrase);
        }
      }
    });
    setPositiveOutput(tokens.join(', ').replace(/,\s*,/g, ',').trim());
    setNegativeOutput(currentPreset.negative);
    showToastNotice("Matrix Compiled Successfully!");
  };

  const showToastNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const copyTerminalContent = (text: string) => {
    navigator.clipboard.writeText(text);
    showToastNotice("Tokens safely extracted to clipboard!");
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans animate-in fade-in duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] bg-[#c5a059] text-black text-xs font-black px-6 py-3 rounded-xl shadow-2xl border border-[#c5a059]/50 animate-in slide-in-from-top-5 space-x-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      <div className="relative w-full max-w-5xl bg-[#faf9f5] dark:bg-[#061a14] text-[#061a14] dark:text-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/40 dark:border-[#c5a059]/30 h-[90vh] flex flex-col transition-colors duration-300">
        
        <div className="p-5 border-b border-[#c5a059]/20 flex justify-between items-center bg-black/[0.03] dark:bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a059] rounded-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#c5a059] italic">Prompt Matrix</h2>
              <p className="text-[9px] text-gray-500 dark:text-white/40 font-mono tracking-widest uppercase">Neural Prompt Engineering Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowGuide(true)} 
              className="flex items-center gap-2 px-4 py-2 bg-[#c5a059]/10 text-[#c5a059] rounded-xl text-xs font-bold hover:bg-[#c5a059] hover:text-black transition-all border border-[#c5a059]/30 shadow-sm"
            >
              <BookOpen className="w-4 h-4" /> Matrix Guide
            </button>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors border border-black/5 dark:border-white/5">
              <X className="w-5 h-5 text-gray-500 dark:text-white/60" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          <div className="w-full lg:w-80 border-r border-[#c5a059]/10 p-5 bg-black/[0.01] dark:bg-black/20 space-y-5 overflow-y-auto custom-scroll">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-wider block">NPU Bias Presets</span>
              <div className="grid grid-cols-3 gap-1 bg-gray-200/50 dark:bg-black/50 p-1 rounded-xl border border-black/5 dark:border-white/5">
                {['absolute', 'chillout', 'yuki'].map(key => (
                  <button 
                    key={key} 
                    onClick={() => setModelBias(key)}
                    className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${modelBias === key ? 'bg-[#c5a059] text-black shadow-md' : 'text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white'}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-wider block">0. Dynamic Input Layer</span>
              <textarea 
                value={corePrompt}
                onChange={(e) => setCorePrompt(e.target.value)}
                placeholder="Type keywords (e.g., car, woman) to trigger Neural mapping engine..."
                className="w-full h-32 bg-white dark:bg-black/40 border border-gray-200 dark:border-[#c5a059]/20 rounded-xl p-3 text-xs font-mono focus:border-[#c5a059] outline-none transition-all resize-none text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-white/10 shadow-inner"
              />
            </div>

            <div className="p-4 bg-gray-100/80 dark:bg-black/40 rounded-xl border border-[#c5a059]/20 dark:border-[#c5a059]/10 space-y-2">
              <div className="flex items-center gap-2 text-[#c5a059]">
                <Cpu className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase">System Analytics</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-white/40 leading-relaxed font-mono">
                Active Channels: 11 Base Matrices<br />
                Neural Syncing: Online<br />
                Constraint Rules: Armed
              </p>
            </div>
          </div>

          <div className="flex-1 p-5 bg-[#f6f5ee] dark:bg-[#04120e] overflow-y-auto custom-scroll space-y-6 transition-colors">
            
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/5 pb-2">
              <LayoutGrid className="w-4 h-4 text-[#c5a059]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-white/40">Hierarchy Tokens Engine</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {Object.keys(PROMPT_MATRIX).map(key => {
                const layer = PROMPT_MATRIX[key];
                const isDisabledList = disabledOptions[key] || [];
                const highlightTarget = highlights[key];
                const isHighlighted = selections[key] === highlightTarget;
                return (
                  <div key={key} className={`border p-3.5 rounded-xl space-y-2 transition-all ${isHighlighted ? 'border-[#c5a059] bg-[#c5a059]/5 dark:bg-black/50 shadow-[0_0_15px_rgba(197,160,89,0.1)]' : 'border-[#c5a059]/10 bg-white dark:bg-black/30 hover:bg-gray-50 dark:hover:bg-black/50'}`}>
                    <label className="text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest block">{layer.label}</label>
                    <div className="relative">
                      <select value={selections[key] || 'AI'} onChange={(e) => handleDropdownChange(key, e.target.value)} className={`w-full bg-[#faf9f3] dark:bg-[#061a14] border border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-[11px] outline-none cursor-pointer transition-colors ${isHighlighted ? 'text-[#c5a059] font-bold' : 'text-gray-700 dark:text-slate-300'}`}>
                        <option value="AI" className="text-[#c5a059] bg-white dark:bg-[#061a14]">✨ AI (Auto-Decide)</option>
                        <option value="NONE" className="text-gray-400 dark:text-white/40 bg-white dark:bg-[#061a14]">⚪ None (Skip Layer)</option>
                        {Object.keys(layer.options).map(opt => (
                          <option key={opt} value={opt} disabled={isDisabledList.includes(opt)} className={isDisabledList.includes(opt) ? 'text-gray-300 dark:text-white/10 bg-white dark:bg-[#061a14]' : opt === highlightTarget ? 'text-[#c5a059] font-bold bg-white dark:bg-[#061a14]' : 'text-gray-700 dark:text-slate-300 bg-white dark:bg-[#061a14]'}>{opt} {opt === highlightTarget ? ' ★' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button onClick={compileMasterMatrix} className="w-full py-4 bg-[#c5a059] text-black font-black text-xs uppercase tracking-[0.25em] rounded-xl hover:bg-[#d4b16a] transition-all active:scale-[0.98] shadow-2xl border border-[#c5a059]/40 group">
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                  Generate Master Matrix Tokens
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest">Enhanced Positive Matrix</span>
                  <button onClick={() => copyTerminalContent(positiveOutput)} className="text-[9px] text-[#c5a059] border border-[#c5a059]/30 px-2.5 py-0.5 rounded hover:bg-[#c5a059] hover:text-black transition-all font-mono">COPY</button>
                </div>
                <div className="bg-white dark:bg-black/60 p-4 rounded-xl text-[11px] font-mono text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-white/5 h-24 overflow-y-auto custom-scroll leading-relaxed select-all shadow-sm">{positiveOutput}</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-rose-600 dark:text-rose-500/80 uppercase tracking-widest">Anti-Artifact Negative Matrix</span>
                  <button onClick={() => copyTerminalContent(negativeOutput)} className="text-[9px] text-rose-600 dark:text-rose-500/80 border border-rose-500/20 px-2.5 py-0.5 rounded hover:bg-rose-500 hover:text-white transition-all font-mono">COPY</button>
                </div>
                <div className="bg-white dark:bg-black/60 p-4 rounded-xl text-[11px] font-mono text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-white/5 h-24 overflow-y-auto custom-scroll leading-relaxed select-all shadow-sm">{negativeOutput}</div>
              </div>
            </div>
          </div>
        </div>

        {showGuide && (
          <div className="absolute inset-0 z-[110] bg-[#faf9f5] dark:bg-[#061a14] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-[#c5a059]/20 flex justify-between items-center bg-black/[0.03] dark:bg-black/40">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#c5a059]" />
                <h3 className="text-lg font-black text-[#c5a059] uppercase tracking-tight">Prompt Matrix Architecture Guide</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-200/50 dark:bg-black/40 p-1 rounded-xl border border-black/5 dark:border-white/10">
                  <button onClick={() => setGuideLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${guideLang === 'en' ? 'bg-[#c5a059] text-black shadow-sm' : 'text-gray-500'}`}>English</button>
                  <button onClick={() => setGuideLang('ur')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${guideLang === 'ur' ? 'bg-[#c5a059] text-black shadow-sm' : 'text-gray-500'}`}>اردو</button>
                </div>
                <button onClick={() => setShowGuide(false)} className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/5 dark:border-white/5"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className={`flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-12 ${guideLang === 'ur' ? 'text-right' : 'text-left'}`} dir={guideLang === 'ur' ? 'rtl' : 'ltr'}>
              {guideLang === 'en' ? (
                <>
                  <section className="space-y-4">
                    <h4 className="text-xl font-black text-[#c5a059] flex items-center gap-2"><ChevronRight className="w-5 h-5" /> What is the Prompt Matrix?</h4>
                    <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium">The Prompt Matrix is a high-performance prompt structuring engine built for local hardware NPU inference pipelines. It organizes basic descriptive instructions into an interconnected 11-level deep mathematical array, increasing overall prompt composition fidelity and aesthetic details.</p>
                  </section>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-[#c5a059]/10 space-y-3 shadow-sm">
                      <div className="p-2 bg-[#c5a059]/10 rounded-lg w-fit text-[#c5a059]"><Clock className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm text-[#c5a059]">Step 1: Dynamic Keyword Scanner</h5>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">Type your primary concept keywords inside the layer. The back-end scanner mapping engine hooks keywords instantly to identify base models without requiring additional configuration.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-[#c5a059]/10 space-y-3 shadow-sm">
                      <div className="p-2 bg-[#c5a059]/10 rounded-lg w-fit text-[#c5a059]"><Video className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm text-[#c5a059]">Step 2: Constraint Verification Matrix</h5>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">System tracking options dynamically check and block non-compatible configurations. Choosing cross-field metrics auto-highlights safe values and drops artifact risks down to zero.</p>
                    </div>
                  </div>
                  <section className="space-y-4 pt-4">
                    <h4 className="text-xl font-black text-[#c5a059] flex items-center gap-2"><ChevronRight className="w-5 h-5" /> How to Deploy Generated Tokens</h4>
                    <div className="space-y-4">
                      {["Compile high-voltage descriptive vectors via the Master Matrix trigger button.", "Extract the processed layers safely using integrated copy interface badges.", "Inject token passes directly into your local offline models (AbsoluteReality, YukiMix).", "Achieve optimized high-fidelity rendering outputs natively matching your design system specifications."].map((txt, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#c5a059] text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">0{i+1}</div>
                          <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{txt}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-4">
                    <h4 className="text-xl font-black text-[#c5a059] flex items-center gap-2"><ChevronLeft className="w-5 h-5" /> پرامپٹ میٹرکس کیا ہے؟</h4>
                    <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium">پرامپٹ میٹرکس ایک انتہائی طاقتور ٹوکن انجینئرنگ سسٹم ہے جو مقامی این پی یو (NPU Checkpoints) کے لیے مخصوص ہے۔ یہ آپ کے سادہ الفاظ کو 11 گہری تہوں کے ریاضیاتی فریم ورک سے گزار کر امیج جنریشن کی کوالٹی اور تفصیلات کو عروج پر پہنچاتا ہے۔</p>
                  </section>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-[#c5a059]/10 space-y-3 shadow-sm">
                      <div className="p-2 bg-[#c5a059]/10 rounded-lg w-fit text-[#c5a059] self-end"><Clock className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm text-[#c5a059]">مرحلہ 1: لائیو کی ورڈ سکیننگ لاجک</h5>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">ان پٹ ورک سپیس میں اپنا کانسیپٹ ٹائپ کریں۔ بیک گراؤنڈ نیورل سکینر الفاظ کو خودکار ٹریک کر کے متعلقہ بیس کیٹیگری کو فوری لاک کر دے گا۔</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-[#c5a059]/10 space-y-3 shadow-sm">
                      <div className="p-2 bg-[#c5a059]/10 rounded-lg w-fit text-[#c5a059] self-end"><Video className="w-5 h-5" /></div>
                      <h5 className="font-bold text-sm text-[#c5a059]">مرحلہ 2: باہمی مطابقت (Dependency Constraints)</h5>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">سسٹم ڈراپ ڈاؤنز غیر موزوں آپشنز کو آپس میں ٹکرانے سے روکتے ہیں۔ ایک پیرامیٹر چننے سے متضاد آپشنز خودکار ڈس ایبل ہو کر ٹوکنز کو محفوظ بناتے ہیں۔</p>
                    </div>
                  </div>
                  <section className="space-y-4 pt-4">
                    <h4 className="text-xl font-black text-[#c5a059] flex items-center gap-2"><ChevronLeft className="w-5 h-5" /> تیار کردہ ٹوکنز کو استعمال کرنے کا طریقہ</h4>
                    <div className="space-y-4">
                      {["ماسٹر میٹرکس ٹوکن بٹن دبا کر فائنل ہائی ڈینسٹی پیرامیٹرز کمپائل کریں۔", "انٹیگریٹڈ کاپی کنٹرولز کے ذریعے پازیٹو اور نیگیٹو آؤٹ پٹ کو بحفاظت ایکسٹریکٹ کریں۔", "ان کمپائلڈ پرامپٹس کو براہِ راست اپنے آف لائن سافٹ ویئرز (AbsoluteReality یا YukiMix) میں استعمال کریں۔", "ڈیزائن سسٹم کے عین مطابق انتہائی شاندار اور ہائی ریزولیوشن رینڈرز حاصل کریں۔"].map((txt, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#c5a059] text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">0{i+1}</div>
                          <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{txt}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}