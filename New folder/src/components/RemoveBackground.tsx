import { useState, useCallback, useRef } from 'react';
import { removeBackground, getColorAtPixel, detectBackgroundColor, type RemoveOptions, type RemoveResult } from '../utils/backgroundRemover';

interface FileItem {
  id: string;
  file: File;
  preview: string;
  result?: RemoveResult;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function RemoveBackground() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [tolerance, setTolerance] = useState(30);
  const [feathering, setFeathering] = useState(2);
  const [refinement, setRefinement] = useState(25);
  const [mode, setMode] = useState<'ai' | 'auto' | 'manual'>('ai');
  const [connectedOnly, setConnectedOnly] = useState(true);
  const [manualColor, setManualColor] = useState<[number, number, number] | null>(null);
  const [detectedColor, setDetectedColor] = useState<[number, number, number] | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showAfter, setShowAfter] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiCreditsInfo, setApiCreditsInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const selectedFile = files.find((f) => f.id === selectedFileId);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const items: FileItem[] = imageFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...items]);

    if (!selectedFileId && items.length > 0) {
      setSelectedFileId(items[0].id);
      try {
        const color = await detectBackgroundColor(items[0].preview);
        setDetectedColor(color);
      } catch { /* ignore */ }
    }
  }, [selectedFileId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  }, [handleFiles]);

  const selectFile = useCallback(async (id: string) => {
    setSelectedFileId(id);
    const file = files.find((f) => f.id === id);
    if (file) {
      try {
        const color = await detectBackgroundColor(file.preview);
        setDetectedColor(color);
      } catch { /* ignore */ }
    }
  }, [files]);

  const handleImageClick = useCallback(async (e: React.MouseEvent<HTMLImageElement>) => {
    if (mode !== 'manual' || !selectedFile) return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    try {
      const color = await getColorAtPixel(selectedFile.preview, x, y, rect.width, rect.height);
      setManualColor(color);
    } catch { /* ignore */ }
  }, [mode, selectedFile]);

  const processFile = useCallback(async (fileItem: FileItem) => {
    setFiles((prev) => prev.map((f) => f.id === fileItem.id ? { ...f, status: 'processing' } : f));

    const options: RemoveOptions = {
      tolerance,
      feathering,
      mode,
      manualColor: mode === 'manual' && manualColor ? manualColor : undefined,
      connectedOnly,
      refinement,
    };

    try {
      const result = await removeBackground(fileItem.preview, options, fileItem.file);
      setFiles((prev) => prev.map((f) => f.id === fileItem.id ? { ...f, status: 'done', result } : f));
      setShowAfter((prev) => ({ ...prev, [fileItem.id]: true }));
      if (mode === 'ai') {
        setApiCreditsInfo('AI processing complete');
      }
    } catch (err) {
      const errorMsg = (err as Error).message;
      setFiles((prev) => prev.map((f) =>
        f.id === fileItem.id ? { ...f, status: 'error', error: errorMsg } : f
      ));
      // If AI mode fails, show helpful error
      if (mode === 'ai' && errorMsg.includes('402')) {
        setApiCreditsInfo('API credits exhausted. Try Manual or Auto mode instead.');
      }
    }
  }, [tolerance, feathering, mode, manualColor, connectedOnly, refinement]);

  const processAll = useCallback(async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    for (const file of files) {
      await processFile(file);
    }
    setIsProcessing(false);
  }, [files, processFile]);

  const processSingle = useCallback(async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;
    setIsProcessing(true);
    await processFile(file);
    setIsProcessing(false);
  }, [files, processFile]);

  const downloadFile = useCallback((file: FileItem) => {
    if (!file.result) return;
    const a = document.createElement('a');
    a.href = file.result.url;
    const baseName = file.file.name.replace(/\.[^.]+$/, '');
    a.download = `${baseName}-no-bg.png`;
    a.click();
  }, []);

  const downloadAll = useCallback(() => {
    files.filter((f) => f.result).forEach((f) => downloadFile(f));
  }, [files, downloadFile]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(files.find((f) => f.id !== id)?.id ?? null);
    }
  }, [files, selectedFileId]);

  const clearAll = useCallback(() => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.preview);
      if (f.result) URL.revokeObjectURL(f.result.url);
    });
    setFiles([]);
    setSelectedFileId(null);
    setDetectedColor(null);
    setManualColor(null);
    setApiCreditsInfo(null);
  }, [files]);

  const bgColorToUse = mode === 'manual' && manualColor ? manualColor : detectedColor;

  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* ── Drop Zone ── */}
      {files.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? 'border-violet-500 bg-violet-50 scale-[1.02]'
              : 'border-slate-200 bg-gradient-to-br from-white to-violet-50/30 hover:border-violet-400 hover:bg-violet-50/50'
          }`}
        >
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleInputChange} />
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${isDragging ? 'bg-violet-200 scale-110' : 'bg-violet-100'}`}>
            <svg className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-700">
            {isDragging ? 'Drop images here!' : 'Drop images or click to browse'}
          </p>
          <p className="mt-1 text-sm text-slate-400">Supports JPG, PNG, WebP, GIF, BMP</p>
          {/* AI Badge */}
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1 text-xs font-semibold text-violet-700 border border-violet-200">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI-Powered by remove.bg
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Select Images
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-6">
          {/* ── Add More & Actions Bar ── */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add More
            </button>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleInputChange} />

            <span className="text-sm text-slate-400">{files.length} image{files.length !== 1 ? 's' : ''}</span>

            <div className="flex-1" />

            {doneCount > 0 && (
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 hover:bg-violet-700 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download All ({doneCount})
              </button>
            )}

            <button
              onClick={clearAll}
              className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Clear All
            </button>
          </div>

          {/* ── Main Layout: Preview + Controls ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Preview Area */}
            <div className="lg:col-span-2 space-y-4">
              {selectedFile && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-700 truncate max-w-[60%]">
                      {selectedFile.file.name}
                    </h3>
                    {selectedFile.result && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAfter((prev) => ({ ...prev, [selectedFile.id]: false }))}
                          className={`px-3 py-1 text-xs font-medium rounded-l-lg transition ${
                            !showAfter[selectedFile.id]
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          Before
                        </button>
                        <button
                          onClick={() => setShowAfter((prev) => ({ ...prev, [selectedFile.id]: true }))}
                          className={`px-3 py-1 text-xs font-medium rounded-r-lg transition ${
                            showAfter[selectedFile.id]
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          After
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Image Preview */}
                  <div
                    className="relative rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]"
                    style={{
                      backgroundImage:
                        showAfter[selectedFile.id] && selectedFile.result
                          ? 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)'
                          : undefined,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      backgroundColor: showAfter[selectedFile.id] && selectedFile.result ? '#f8fafc' : '#f1f5f9',
                    }}
                  >
                    {selectedFile.status === 'processing' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
                          {mode === 'ai' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-sm font-medium text-violet-700">
                          {mode === 'ai' ? 'AI is removing background...' : 'Removing background...'}
                        </p>
                        {mode === 'ai' && (
                          <p className="mt-1 text-xs text-slate-400">Powered by remove.bg AI</p>
                        )}
                      </div>
                    )}
                    <img
                      ref={imgRef}
                      src={showAfter[selectedFile.id] && selectedFile.result ? selectedFile.result.url : selectedFile.preview}
                      alt="Preview"
                      className={`max-h-[450px] max-w-full object-contain ${
                        mode === 'manual' && !selectedFile.result ? 'cursor-crosshair' : ''
                      }`}
                      onClick={handleImageClick}
                      draggable={false}
                    />
                  </div>

                  {/* Result Info */}
                  {selectedFile.result && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1">
                        <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-xs font-semibold text-green-700">
                          {selectedFile.result.removedPercent}% removed
                        </span>
                      </div>
                      {mode === 'ai' && (
                        <div className="flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5">
                          <svg className="h-3 w-3 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                          <span className="text-[10px] font-semibold text-violet-700">AI Processed</span>
                        </div>
                      )}
                      <span className="text-xs text-slate-400">
                        {selectedFile.result.width} × {selectedFile.result.height}px
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">
                        {formatFileSize(selectedFile.result.blob.size)} (PNG)
                      </span>
                      <div className="flex-1" />
                      <button
                        onClick={() => downloadFile(selectedFile)}
                        className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 transition"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download PNG
                      </button>
                    </div>
                  )}

                  {selectedFile.status === 'error' && (
                    <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-red-700">Error processing image</p>
                          <p className="text-xs text-red-600 mt-0.5">{selectedFile.error}</p>
                          {mode === 'ai' && (
                            <p className="text-xs text-red-500 mt-1">
                              Try switching to <button onClick={() => setMode('auto')} className="underline font-semibold hover:text-red-700">Auto Detect</button> or <button onClick={() => setMode('manual')} className="underline font-semibold hover:text-red-700">Manual</button> mode instead.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {mode === 'manual' && !selectedFile.result && selectedFile.status !== 'processing' && (
                    <p className="mt-2 text-xs text-violet-500 text-center">
                      👆 Click on the image to pick the background color to remove
                    </p>
                  )}
                </div>
              )}

              {/* ── Thumbnail Strip ── */}
              {files.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {files.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => selectFile(f.id)}
                      className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                        selectedFileId === f.id
                          ? 'border-violet-500 shadow-md'
                          : 'border-slate-200 hover:border-violet-300'
                      }`}
                    >
                      <img src={f.preview} alt="" className="h-16 w-16 object-cover" />
                      {f.status === 'done' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-600/20">
                          <svg className="h-5 w-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                      {f.status === 'processing' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                          <div className="h-5 w-5 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
                        </div>
                      )}
                      {f.status === 'error' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-600/20">
                          <svg className="h-5 w-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5 opacity-0 hover:opacity-100 transition"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Controls Panel */}
            <div className="space-y-4">
              {/* Detection Mode */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Removal Mode
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {/* AI Mode */}
                  <button
                    onClick={() => setMode('ai')}
                    className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-xs font-medium transition border ${
                      mode === 'ai'
                        ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-400 text-violet-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'ai' && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[8px] text-white font-bold">✓</span>
                    )}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${mode === 'ai' ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <span className="leading-tight">AI</span>
                    <span className="text-[9px] opacity-70 leading-tight">Best Quality</span>
                  </button>

                  {/* Auto Detect */}
                  <button
                    onClick={() => setMode('auto')}
                    className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-xs font-medium transition border ${
                      mode === 'auto'
                        ? 'bg-violet-50 border-violet-300 text-violet-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'auto' && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[8px] text-white font-bold">✓</span>
                    )}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${mode === 'auto' ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <span className="leading-tight">Auto</span>
                    <span className="text-[9px] opacity-70 leading-tight">Client-side</span>
                  </button>

                  {/* Manual Pick */}
                  <button
                    onClick={() => setMode('manual')}
                    className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-xs font-medium transition border ${
                      mode === 'manual'
                        ? 'bg-violet-50 border-violet-300 text-violet-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'manual' && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[8px] text-white font-bold">✓</span>
                    )}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${mode === 'manual' ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5" />
                      </svg>
                    </div>
                    <span className="leading-tight">Manual</span>
                    <span className="text-[9px] opacity-70 leading-tight">Pick Color</span>
                  </button>
                </div>

                {/* AI Mode Info */}
                {mode === 'ai' && (
                  <div className="mt-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-violet-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      <div>
                        <p className="text-[11px] font-semibold text-violet-700">AI-Powered Removal</p>
                        <p className="text-[10px] text-violet-600/80 mt-0.5">
                          Uses advanced AI to detect and remove backgrounds with exceptional quality. Works on complex backgrounds, hair, fur, and transparent objects.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detected / Picked Color for non-AI modes */}
                {mode !== 'ai' && bgColorToUse && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-100">
                    <div
                      className="h-8 w-8 rounded-lg border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: `rgb(${bgColorToUse[0]}, ${bgColorToUse[1]}, ${bgColorToUse[2]})` }}
                    />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                        {mode === 'manual' && manualColor ? 'Picked Color' : 'Detected BG'}
                      </p>
                      <p className="text-xs font-mono text-slate-600">
                        rgb({bgColorToUse[0]}, {bgColorToUse[1]}, {bgColorToUse[2]})
                      </p>
                    </div>
                  </div>
                )}

                {/* API Credits Info */}
                {apiCreditsInfo && (
                  <div className={`mt-2 rounded-lg px-3 py-1.5 text-[10px] font-medium ${
                    apiCreditsInfo.includes('exhausted') || apiCreditsInfo.includes('error')
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {apiCreditsInfo}
                  </div>
                )}
              </div>

              {/* Settings - only for non-AI modes */}
              {mode !== 'ai' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                    Settings
                  </h4>

                  {/* Tolerance Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-600">Tolerance</label>
                      <span className="text-xs font-bold text-violet-600">{tolerance}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={tolerance}
                      onChange={(e) => setTolerance(Number(e.target.value))}
                      className="w-full accent-violet-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Precise</span>
                      <span>Aggressive</span>
                    </div>
                  </div>

                  {/* Feathering Slider */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-600">Edge Softness</label>
                      <span className="text-xs font-bold text-violet-600">{feathering}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={feathering}
                      onChange={(e) => setFeathering(Number(e.target.value))}
                      className="w-full accent-violet-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Sharp</span>
                      <span>Soft</span>
                    </div>
                  </div>

                  {/* Refinement Slider */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-600">Refinement</label>
                      <span className="text-xs font-bold text-violet-600">{refinement}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={refinement}
                      onChange={(e) => setRefinement(Number(e.target.value))}
                      className="w-full accent-violet-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Raw</span>
                      <span>Smooth</span>
                    </div>
                  </div>

                  {/* Connected Only Toggle */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => setConnectedOnly(!connectedOnly)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${connectedOnly ? 'bg-violet-600' : 'bg-slate-300'}`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          connectedOnly ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <div>
                      <p className="text-xs font-medium text-slate-600">Connected Only</p>
                      <p className="text-[10px] text-slate-400">Only remove bg touching edges</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI mode advantages */}
              {mode === 'ai' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">✨ AI Advantages</h4>
                  <ul className="space-y-2">
                    {[
                      { icon: '🎯', title: 'Pixel-perfect edges', desc: 'Handles hair, fur & fine details' },
                      { icon: '🌈', title: 'Complex backgrounds', desc: 'Gradients, patterns, photos' },
                      { icon: '👤', title: 'People & products', desc: 'Optimized for subjects' },
                      { icon: '⚡', title: 'No settings needed', desc: 'One-click professional results' },
                    ].map((item) => (
                      <li key={item.title} className="flex items-start gap-2.5">
                        <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{item.title}</p>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Process Buttons */}
              <div className="space-y-2">
                {selectedFile && selectedFile.status !== 'processing' && (
                  <button
                    onClick={() => processSingle(selectedFile.id)}
                    disabled={isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {mode === 'ai' ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    )}
                    {mode === 'ai' ? 'Remove with AI' : 'Remove Background'}
                  </button>
                )}
                {files.length > 1 && (
                  <button
                    onClick={processAll}
                    disabled={isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-violet-300 px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-all disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Process All ({files.length})
                  </button>
                )}
              </div>

              {/* Quick Tips */}
              <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-purple-50/50 p-4">
                <h4 className="text-xs font-semibold text-violet-700 mb-2">💡 Tips</h4>
                <ul className="space-y-1.5">
                  <li className="text-[11px] text-slate-500 flex gap-1.5">
                    <span className="text-violet-400 flex-shrink-0">•</span>
                    <b>AI mode</b> gives the best results for complex images
                  </li>
                  <li className="text-[11px] text-slate-500 flex gap-1.5">
                    <span className="text-violet-400 flex-shrink-0">•</span>
                    Use <b>Auto</b> for solid-color backgrounds (works offline)
                  </li>
                  <li className="text-[11px] text-slate-500 flex gap-1.5">
                    <span className="text-violet-400 flex-shrink-0">•</span>
                    Use <b>Manual</b> to click the exact bg color to remove
                  </li>
                  <li className="text-[11px] text-slate-500 flex gap-1.5">
                    <span className="text-violet-400 flex-shrink-0">•</span>
                    Increase <b>Tolerance</b> for gradient backgrounds
                  </li>
                  <li className="text-[11px] text-slate-500 flex gap-1.5">
                    <span className="text-violet-400 flex-shrink-0">•</span>
                    <b>Auto & Manual</b> modes work completely offline
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Results Grid (for batch) ── */}
          {files.length > 1 && doneCount > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Processed Images ({doneCount}/{files.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.filter((f) => f.result).map((f) => (
                  <div key={f.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex gap-3">
                      {/* Before */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <img src={f.preview} alt="" className="w-full h-full object-cover" />
                      </div>
                      {/* After */}
                      <div
                        className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
                        style={{
                          backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                          backgroundSize: '10px 10px',
                          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                          backgroundColor: '#f8fafc',
                        }}
                      >
                        <img src={f.result!.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{f.file.name}</p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                            {f.result!.removedPercent}% removed
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {formatFileSize(f.file.size)} → {formatFileSize(f.result!.blob.size)}
                        </p>
                        <button
                          onClick={() => downloadFile(f)}
                          className="mt-2 flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-violet-700 transition"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
