import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ResizedFile,
  ResizeOptions,
  PRESETS,
  resizeImage,
  generateId,
  // formatFileSize imported but we use local copy
  getImageDimensions,
  getOutputFileName,
  calculateTargetDimensions,
} from '../utils/resizer';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'];

export function ResizeImage() {
  const [files, setFiles] = useState<ResizedFile[]>([]);
  const [mode, setMode] = useState<ResizeOptions['mode']>('exact');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [percentage, setPercentage] = useState(50);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<ResizeOptions['outputFormat']>('auto');
  const [quality, setQuality] = useState(90);
  const [bgColor] = useState('#ffffff');
  const [isResizing, setIsResizing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    const imageFiles = selectedFiles.filter((f) => ACCEPTED_TYPES.includes(f.type) || f.name.toLowerCase().endsWith('.svg'));
    if (imageFiles.length === 0) return;

    const newFiles: ResizedFile[] = await Promise.all(
      imageFiles.map(async (file) => {
        const dims = await getImageDimensions(file).catch(() => ({ width: 0, height: 0 }));
        return {
          id: generateId(),
          originalFile: file,
          originalSize: file.size,
          originalPreview: URL.createObjectURL(file),
          originalWidth: dims.width,
          originalHeight: dims.height,
          resizedBlob: null,
          resizedSize: 0,
          resizedPreview: '',
          resizedWidth: 0,
          resizedHeight: 0,
          status: 'pending' as const,
        };
      })
    );

    setFiles((prev) => [...prev, ...newFiles]);

    // If no dimensions set yet, use first image's dimensions
    if (width === 0 && height === 0 && newFiles.length > 0 && newFiles[0].originalWidth > 0) {
      setWidth(newFiles[0].originalWidth);
      setHeight(newFiles[0].originalHeight);
    }
  }, [width, height]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!isResizing) {
        handleFilesSelected(Array.from(e.dataTransfer.files));
      }
    },
    [isResizing, handleFilesSelected]
  );

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.originalPreview);
        if (file.resizedPreview) URL.revokeObjectURL(file.resizedPreview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handlePreset = useCallback((presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    setMode('exact');
    setMaintainAspectRatio(false);
    setShowPresets(false);
  }, []);

  const handleWidthChange = useCallback((newW: number) => {
    setWidth(newW);
    if (maintainAspectRatio && files.length > 0 && files[0].originalWidth > 0) {
      const ratio = files[0].originalHeight / files[0].originalWidth;
      setHeight(Math.round(newW * ratio));
    }
  }, [maintainAspectRatio, files]);

  const handleHeightChange = useCallback((newH: number) => {
    setHeight(newH);
    if (maintainAspectRatio && files.length > 0 && files[0].originalHeight > 0) {
      const ratio = files[0].originalWidth / files[0].originalHeight;
      setWidth(Math.round(newH * ratio));
    }
  }, [maintainAspectRatio, files]);

  const handleResizeAll = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) return;

    setIsResizing(true);
    const options: ResizeOptions = { mode, width, height, percentage, maintainAspectRatio, outputFormat, quality, bgColor };

    for (const file of pendingFiles) {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: 'resizing' as const } : f))
      );
      try {
        const result = await resizeImage(file.originalFile, options, file.originalWidth, file.originalHeight);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  resizedBlob: result.blob,
                  resizedSize: result.blob.size,
                  resizedPreview: result.previewUrl,
                  resizedWidth: result.width,
                  resizedHeight: result.height,
                  status: 'done' as const,
                }
              : f
          )
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: 'error' as const, error: err instanceof Error ? err.message : 'Resize failed' }
              : f
          )
        );
      }
    }
    setIsResizing(false);
  }, [files, mode, width, height, percentage, maintainAspectRatio, outputFormat, quality, bgColor]);

  const handleDownload = useCallback((file: ResizedFile) => {
    if (!file.resizedBlob) return;
    const url = URL.createObjectURL(file.resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getOutputFileName(file.originalFile.name, file.resizedBlob.type, file.resizedWidth, file.resizedHeight);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadAll = useCallback(() => {
    const doneFiles = files.filter((f) => f.status === 'done' && f.resizedBlob);
    doneFiles.forEach((file, index) => {
      setTimeout(() => handleDownload(file), index * 300);
    });
  }, [files, handleDownload]);

  const handleClearAll = useCallback(() => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.originalPreview);
      if (f.resizedPreview) URL.revokeObjectURL(f.resizedPreview);
    });
    setFiles([]);
  }, [files]);

  // Preview calculation for first file
  const previewDims = useMemo(() => {
    if (files.length === 0 || files[0].originalWidth === 0) return null;
    const f = files[0];
    const options: ResizeOptions = { mode, width, height, percentage, maintainAspectRatio, outputFormat, quality, bgColor };
    return calculateTargetDimensions(f.originalWidth, f.originalHeight, options);
  }, [files, mode, width, height, percentage, maintainAspectRatio, outputFormat, quality, bgColor]);

  const pendingCount = files.filter((f) => f.status === 'pending' || f.status === 'error').length;
  const doneCount = files.filter((f) => f.status === 'done').length;
  const hasFiles = files.length > 0;

  const getQualityLabel = () => {
    if (quality >= 90) return { text: 'Highest', color: 'text-green-600' };
    if (quality >= 75) return { text: 'High', color: 'text-emerald-600' };
    if (quality >= 50) return { text: 'Medium', color: 'text-yellow-600' };
    if (quality >= 25) return { text: 'Low', color: 'text-orange-600' };
    return { text: 'Lowest', color: 'text-red-600' };
  };
  const ql = getQualityLabel();

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); if (!isResizing) setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
        onClick={() => !isResizing && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-rose-500 bg-rose-50 scale-[1.02] shadow-lg shadow-rose-100'
            : 'border-slate-300 bg-white hover:border-rose-400 hover:bg-rose-50/50'
        } ${isResizing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFilesSelected(Array.from(e.target.files));
            e.target.value = '';
          }}
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`rounded-2xl p-4 transition-colors ${isDragOver ? 'bg-rose-100' : 'bg-gradient-to-br from-rose-50 to-orange-50'}`}>
            <svg className={`h-10 w-10 transition-colors ${isDragOver ? 'text-rose-600' : 'text-rose-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">{isDragOver ? 'Drop your images here' : 'Drag & drop images here'}</p>
            <p className="mt-1 text-sm text-slate-500">
              or <span className="font-medium text-rose-600 hover:text-rose-700">browse files</span> from your computer
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="text-xs font-medium text-slate-500">JPG, PNG, WebP, GIF, SVG • Batch support</span>
          </div>
        </div>
      </div>

      {/* Settings & Files */}
      {hasFiles && (
        <div className="mt-6 space-y-4">
          {/* Resize Settings */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Mode Tabs */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Resize Mode</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'exact' as const, label: 'By Pixels', icon: '📐' },
                  { id: 'percentage' as const, label: 'By Percentage', icon: '📊' },
                  { id: 'fit' as const, label: 'Fit Within', icon: '🔲' },
                  { id: 'fill' as const, label: 'Fill & Crop', icon: '🖼️' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                      mode === m.id
                        ? 'bg-rose-100 text-rose-700 shadow-sm ring-1 ring-rose-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Dimensions / Percentage */}
              {mode === 'percentage' ? (
                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Scale</label>
                    <span className="rounded-md bg-rose-100 px-2 py-0.5 text-sm font-bold text-rose-700">{percentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="400"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-rose-200 via-rose-300 to-orange-300
                      [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500 [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none
                      [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md
                      [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                    <span>1%</span>
                    <span>100% (original)</span>
                    <span>400%</span>
                  </div>
                  {/* Quick percentage buttons */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[25, 50, 75, 100, 150, 200].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPercentage(p)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                          percentage === p
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">
                      {mode === 'exact' ? 'New Dimensions (px)' : mode === 'fit' ? 'Maximum Size (px)' : 'Target Size (px)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPresets(!showPresets)}
                        className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600 transition-all hover:bg-rose-100"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        Presets
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="1"
                        placeholder="Width"
                        value={width || ''}
                        onChange={(e) => handleWidthChange(Number(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">W</span>
                    </div>
                    {/* Lock/Unlock aspect ratio */}
                    {mode === 'exact' && (
                      <button
                        onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border transition-all ${
                          maintainAspectRatio
                            ? 'border-rose-200 bg-rose-50 text-rose-600'
                            : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                        title={maintainAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                      >
                        {maintainAspectRatio ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 006.364 6.364l1.757-1.757" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 011.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 006.364 6.365l3.129-3.129m5.614-5.615l1.757-1.757a4.5 4.5 0 00-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 01-1.242-.88 4.483 4.483 0 01-1.062-1.683m6.587-5.684l-1.757 1.757" />
                          </svg>
                        )}
                      </button>
                    )}
                    {mode !== 'exact' && <span className="text-slate-300 font-medium">×</span>}
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="1"
                        placeholder="Height"
                        value={height || ''}
                        onChange={(e) => handleHeightChange(Number(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">H</span>
                    </div>
                  </div>
                  {mode === 'exact' && (
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      {maintainAspectRatio ? '🔗 Aspect ratio locked — changing one dimension updates the other' : '🔓 Aspect ratio unlocked — set width and height independently'}
                    </p>
                  )}
                  {mode === 'fit' && (
                    <p className="mt-1.5 text-[10px] text-slate-400">Image will be scaled down to fit within these bounds while preserving aspect ratio</p>
                  )}
                  {mode === 'fill' && (
                    <p className="mt-1.5 text-[10px] text-slate-400">Image will be scaled and cropped to exactly fill these dimensions</p>
                  )}

                  {/* Presets Dropdown */}
                  {showPresets && (
                    <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                      {PRESETS.map((group) => (
                        <div key={group.label} className="mb-3 last:mb-0">
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {group.items.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => handlePreset(preset.width, preset.height)}
                                className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2 text-left transition-all hover:bg-rose-50 hover:text-rose-700 group/preset"
                              >
                                <span className="text-xs font-medium text-slate-700 group-hover/preset:text-rose-700">{preset.name}</span>
                                <span className="text-[10px] text-slate-400 group-hover/preset:text-rose-500">{preset.width}×{preset.height}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Output Format */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Output Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as ResizeOptions['outputFormat'])}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                >
                  <option value="auto">Auto (Keep Original)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
                <p className="mt-1.5 text-[10px] text-slate-400">PNG keeps transparency</p>
              </div>

              {/* Quality */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Quality</label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${ql.color}`}>{ql.text}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-800">{quality}%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-red-300 via-yellow-300 to-green-300
                    [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md
                    [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>Smaller</span>
                  <span>Better</span>
                </div>
              </div>
            </div>

            {/* Preview info banner */}
            {previewDims && files.length > 0 && files[0].originalWidth > 0 && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-rose-50 px-4 py-2.5 border border-rose-100">
                <svg className="h-4 w-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
                </svg>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-600">
                    <span className="font-medium">{files[0].originalWidth}×{files[0].originalHeight}</span> px
                  </span>
                  <svg className="h-3 w-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="font-semibold text-rose-700">
                    {previewDims.width}×{previewDims.height} px
                  </span>
                  <span className="rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                    {Math.round((previewDims.width * previewDims.height) / (files[0].originalWidth * files[0].originalHeight) * 100)}% of original
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Summary Bar */}
          {doneCount > 0 && (
            <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-4 shadow-sm animate-fade-slide-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-rose-800">
                      {doneCount} image{doneCount !== 1 ? 's' : ''} resized successfully
                    </p>
                    <p className="text-xs text-rose-600">
                      Ready to download
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{files.length}</span> file{files.length !== 1 ? 's' : ''}
                {doneCount > 0 && <span className="ml-2 text-rose-600">• {doneCount} done</span>}
                {pendingCount > 0 && <span className="ml-2 text-amber-600">• {pendingCount} pending</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                disabled={isResizing}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
              >
                Clear All
              </button>
              {doneCount > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-all hover:bg-rose-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download All
                </button>
              )}
              {pendingCount > 0 && (
                <button
                  onClick={handleResizeAll}
                  disabled={isResizing || (mode !== 'percentage' && width === 0 && height === 0)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-rose-200 transition-all hover:from-rose-700 hover:to-orange-700 hover:shadow-lg disabled:opacity-60"
                >
                  {isResizing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Resizing...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                      Resize {pendingCount > 1 ? `All (${pendingCount})` : 'Now'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* File Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <ResizeCard key={file.id} file={file} onRemove={handleRemove} onDownload={handleDownload} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────── Individual File Card ────────────── */

interface ResizeCardProps {
  file: ResizedFile;
  onRemove: (id: string) => void;
  onDownload: (file: ResizedFile) => void;
}

function ResizeCard({ file, onRemove, onDownload }: ResizeCardProps) {
  const dimensionChanged = file.status === 'done' && (file.resizedWidth !== file.originalWidth || file.resizedHeight !== file.originalHeight);
  const sizeChange = file.status === 'done' && file.resizedSize > 0
    ? Math.round(((file.originalSize - file.resizedSize) / file.originalSize) * 100)
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Remove */}
      <button
        onClick={() => onRemove(file.id)}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500"
        title="Remove"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Dimension Badge */}
      {file.status === 'done' && dimensionChanged && (
        <div className="absolute left-2 top-2 z-10">
          <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            {file.resizedWidth}×{file.resizedHeight}
          </span>
        </div>
      )}

      {/* Preview */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
        <img
          src={file.status === 'done' ? file.resizedPreview : file.originalPreview}
          alt={file.originalFile.name}
          className="max-h-full max-w-full object-contain p-2"
        />
        {file.status === 'resizing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-rose-200 border-t-rose-600" />
              <span className="text-xs font-medium text-rose-600">Resizing...</span>
            </div>
          </div>
        )}
        {file.status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="text-xs font-medium text-red-600">{file.error || 'Error'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="border-t border-slate-100 p-3">
        <p className="truncate text-sm font-medium text-slate-800" title={file.originalFile.name}>
          {file.originalFile.name}
        </p>

        {/* Dimensions */}
        {file.originalWidth > 0 && (
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span>{file.originalWidth}×{file.originalHeight} px</span>
            {file.status === 'done' && file.resizedWidth > 0 && (
              <>
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span className="font-semibold text-rose-600">{file.resizedWidth}×{file.resizedHeight} px</span>
              </>
            )}
          </div>
        )}

        {/* Size */}
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span>{formatFileSize(file.originalSize)}</span>
          {file.status === 'done' && (
            <>
              <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="font-semibold text-slate-700">{formatFileSize(file.resizedSize)}</span>
              {sizeChange !== 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${sizeChange > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                  {sizeChange > 0 ? `-${sizeChange}%` : `+${Math.abs(sizeChange)}%`}
                </span>
              )}
            </>
          )}
        </div>

        {/* Download */}
        {file.status === 'done' && (
          <button
            onClick={() => onDownload(file)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-rose-700 hover:to-orange-700 hover:shadow-md active:scale-[0.98]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>
        )}

        {/* Pending */}
        {file.status === 'pending' && (
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-2 text-xs text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ready to resize
          </div>
        )}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
