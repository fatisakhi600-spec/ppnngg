import { useState, useRef } from 'react';
import {
  generateImage,
  GeneratedImage,
  MODELS,
  STYLE_PRESETS,
  DIMENSION_PRESETS,
  HF_DEFAULT_TOKEN,
} from '../utils/textToImage';

const PROMPT_EXAMPLES = [
  'A majestic dragon flying over a medieval castle at sunset, epic fantasy, detailed scales',
  'Astronaut riding a horse on Mars, photorealistic, cinematic lighting, 8k',
  'A cozy coffee shop interior with rain outside the window, warm lighting, oil painting',
  'Cyberpunk city street at night with neon signs reflecting in puddles, blade runner style',
  'Beautiful Japanese garden with cherry blossoms and a red bridge, serene, watercolor',
  'A cute cat wearing a tiny wizard hat, sitting on a stack of books, digital art',
  'Underwater scene with coral reef and tropical fish, volumetric light rays, detailed',
  'A steampunk mechanical owl perched on a clockwork tree, intricate details, bronze',
];

export function TextToImage() {
  const [token] = useState(() => {
    const saved = localStorage.getItem('hf_token');
    return saved || HF_DEFAULT_TOKEN;
  });
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState(
    'blurry, bad quality, worst quality, low quality, watermark, text, signature, deformed, ugly, disfigured'
  );
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(MODELS[0].defaultSteps);
  const [guidance, setGuidance] = useState(MODELS[0].defaultGuidance);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showNegPrompt, setShowNegPrompt] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Token is pre-configured

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    const model = MODELS.find((m) => m.id === modelId);
    if (model) {
      setSteps(model.defaultSteps);
      setGuidance(model.defaultGuidance);
    }
  };

  const handleDimensionPreset = (w: number, h: number) => {
    setWidth(Math.min(w, currentModel.maxWidth));
    setHeight(Math.min(h, currentModel.maxHeight));
  };

  const getStyledPrompt = () => {
    const style = STYLE_PRESETS[selectedStyle];
    return `${style.prefix}${prompt}${style.suffix}`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const styledPrompt = getStyledPrompt();
      const result = await generateImage(token, {
        prompt: styledPrompt,
        negativePrompt: showNegPrompt ? negativePrompt : undefined,
        model: selectedModel,
        width,
        height,
        numInferenceSteps: steps,
        guidanceScale: guidance,
      });

      setGallery((prev) => [result, ...prev]);
      setSelectedImage(result);

      setTimeout(() => {
        galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `generated_${img.id}.png`;
    a.click();
  };

  const handleRandomPrompt = () => {
    setPrompt(PROMPT_EXAMPLES[Math.floor(Math.random() * PROMPT_EXAMPLES.length)]);
  };

  const handleClear = () => {
    gallery.forEach((img) => URL.revokeObjectURL(img.url));
    setGallery([]);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6">
      {/* API Status */}
      <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-green-800">HuggingFace API Connected</h3>
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-700">READY</span>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-0.5">
              API key pre-configured. Start creating images by entering a prompt below!
            </p>
          </div>
          <span className="text-2xl">🤗</span>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">✨ Your Prompt</h3>
          <button
            onClick={handleRandomPrompt}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:from-purple-100 hover:to-pink-100 transition-colors border border-purple-100"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
            Random Prompt
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create... e.g., 'A majestic dragon flying over a castle at sunset'"
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-slate-400">{prompt.length} characters</span>
          <button
            onClick={() => setShowNegPrompt(!showNegPrompt)}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <svg className={`h-3 w-3 transition-transform ${showNegPrompt ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            Negative Prompt
          </button>
        </div>
        {showNegPrompt && (
          <div className="mt-3">
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Things to avoid... e.g., 'blurry, low quality, watermark'"
              rows={2}
              className="w-full rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 resize-none placeholder:text-red-300"
            />
          </div>
        )}
      </div>

      {/* Style Presets */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">🎨 Style Preset</h3>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((style, idx) => (
            <button
              key={style.name}
              onClick={() => setSelectedStyle(idx)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedStyle === idx
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
        {selectedStyle > 0 && (
          <div className="mt-3 rounded-lg bg-indigo-50 border border-indigo-100 p-3">
            <p className="text-[11px] text-indigo-600">
              <span className="font-semibold">Preview:</span>{' '}
              <span className="italic">{getStyledPrompt() || `${STYLE_PRESETS[selectedStyle].prefix}[your prompt]${STYLE_PRESETS[selectedStyle].suffix}`}</span>
            </p>
          </div>
        )}
      </div>

      {/* Model Selection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">🤖 AI Model</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => handleModelChange(model.id)}
              className={`rounded-xl p-3 text-left transition-all border ${
                selectedModel === model.id
                  ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{model.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${selectedModel === model.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {model.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{model.description}</p>
                </div>
                {selectedModel === model.id && (
                  <svg className="h-4 w-4 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                  model.category === 'Popular' ? 'bg-blue-100 text-blue-700' :
                  model.category === 'Fast' ? 'bg-green-100 text-green-700' :
                  model.category === 'Quality' ? 'bg-purple-100 text-purple-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {model.category}
                </span>
                <span className="text-[9px] text-slate-400">up to {model.maxWidth}×{model.maxHeight}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">📐 Dimensions</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {DIMENSION_PRESETS.filter(d => d.width <= currentModel.maxWidth && d.height <= currentModel.maxHeight).map((d) => (
            <button
              key={d.name}
              onClick={() => handleDimensionPreset(d.width, d.height)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                width === d.width && height === d.height
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.name} <span className="opacity-70">{d.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[11px] font-medium text-slate-500 block mb-1">Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.min(Number(e.target.value), currentModel.maxWidth))}
              min={128}
              max={currentModel.maxWidth}
              step={64}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex items-end pb-2">
            <span className="text-slate-400">×</span>
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-medium text-slate-500 block mb-1">Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.min(Number(e.target.value), currentModel.maxHeight))}
              min={128}
              max={currentModel.maxHeight}
              step={64}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Max for {currentModel.shortName}: {currentModel.maxWidth}×{currentModel.maxHeight} — must be multiples of 64</p>
      </div>

      {/* Advanced Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
        >
          <h3 className="text-sm font-semibold text-slate-800">⚙️ Advanced Settings</h3>
          <svg className={`h-4 w-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {showAdvanced && (
          <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-700">Inference Steps</label>
                <span className="text-xs font-bold text-indigo-600">{steps}</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Fast)</span>
                <span>50 (Quality)</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-700">Guidance Scale</label>
                <span className="text-xs font-bold text-indigo-600">{guidance}</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={guidance}
                onChange={(e) => setGuidance(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 (Creative)</span>
                <span>20 (Strict)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating || !prompt.trim()}
        className={`w-full rounded-2xl py-4 text-base font-bold transition-all shadow-lg ${
          generating
            ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white/80 cursor-wait'
            : !prompt.trim()
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
        }`}
      >
        {generating ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating with {currentModel.shortName}...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Generate Image
          </span>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              {error.includes('loading') && (
                <p className="text-xs text-red-600 mt-1">
                  💡 Tip: Try the FLUX.1 Schnell model — it's usually ready and generates in seconds.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generation Preview / Result */}
      {generating && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-200 to-purple-200 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-10 w-10 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-indigo-700">Creating your image...</p>
              <p className="text-xs text-indigo-500 mt-1">
                Using {currentModel.name} • {steps} steps • {width}×{height}
              </p>
              <p className="text-[10px] text-indigo-400 mt-2">This may take 10-60 seconds depending on the model</p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div ref={galleryRef} className="space-y-6">
          {/* Selected Image View */}
          {selectedImage && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 text-[10px] font-bold text-indigo-700">
                    {MODELS.find(m => m.id === selectedImage.model)?.shortName || 'AI'}
                  </span>
                  <span className="text-xs text-slate-500">{selectedImage.width}×{selectedImage.height}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{selectedImage.steps} steps</span>
                  {selectedImage.guidanceScale > 0 && (
                    <>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">CFG {selectedImage.guidanceScale}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleDownload(selectedImage)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-medium text-white hover:shadow-lg transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </button>
              </div>
              <div className="relative bg-[repeating-conic-gradient(#f1f5f9_0%_25%,white_0%_50%)] bg-[length:20px_20px] flex items-center justify-center p-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="max-w-full max-h-[600px] rounded-lg shadow-xl object-contain"
                />
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Prompt:</span> {selectedImage.prompt}
                </p>
                {selectedImage.negativePrompt && (
                  <p className="text-xs text-red-400 mt-1">
                    <span className="font-semibold text-red-500">Negative:</span> {selectedImage.negativePrompt}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {gallery.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  🖼️ Gallery ({gallery.length} images)
                </h3>
                <button
                  onClick={handleClear}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {gallery.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                      selectedImage?.id === img.id
                        ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[10px] text-white truncate">{img.prompt.slice(0, 60)}...</p>
                      </div>
                    </div>
                    {selectedImage?.id === img.id && (
                      <div className="absolute top-2 right-2">
                        <svg className="h-5 w-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!generating && gallery.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Your generated images will appear here</p>
          <p className="text-xs text-slate-400">Enter a prompt above and click Generate Image to start creating</p>
        </div>
      )}
    </div>
  );
}
