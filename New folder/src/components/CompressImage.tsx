import { useState, useCallback, useRef } from 'react';
import {
  CompressedFile,
  CompressOptions,
  compressImage,
  generateId,
  formatFileSize,
  getImageDimensions,
  getOutputFileName,
} from '../utils/compressor';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp'];

export function CompressImage() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [outputFormat, setOutputFormat] = useState<CompressOptions['outputFormat']>('auto');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    const imageFiles = selectedFiles.filter((f) => ACCEPTED_TYPES.includes(f.type));
    if (imageFiles.length === 0) return;

    const newFiles: CompressedFile[] = await Promise.all(
      imageFiles.map(async (file) => {
        const dims = await getImageDimensions(file).catch(() => ({ width: 0, height: 0 }));
        return {
          id: generateId(),
          originalFile: file,
          originalSize: file.size,
          originalPreview: URL.createObjectURL(file),
          originalWidth: dims.width,
          originalHeight: dims.height,
          compressedBlob: null,
          compressedSize: 0,
          compressedPreview: '',
          compressedWidth: 0,
          compressedHeight: 0,
          status: 'pending' as const,
        };
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!isCompressing) {
        const fileList = Array.from(e.dataTransfer.files);
        handleFilesSelected(fileList);
      }
    },
    [isCompressing, handleFilesSelected]
  );

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.originalPreview);
        if (file.compressedPreview) URL.revokeObjectURL(file.compressedPreview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleCompressAll = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) return;

    setIsCompressing(true);
    const options: CompressOptions = { quality, maxWidth, maxHeight, outputFormat };

    for (const file of pendingFiles) {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: 'compressing' as const } : f))
      );

      try {
        const result = await compressImage(file.originalFile, options);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  compressedBlob: result.blob,
                  compressedSize: result.blob.size,
                  compressedPreview: result.previewUrl,
                  compressedWidth: result.width,
                  compressedHeight: result.height,
                  status: 'done' as const,
                }
              : f
          )
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: 'error' as const,
                  error: err instanceof Error ? err.message : 'Compression failed',
                }
              : f
          )
        );
      }
    }

    setIsCompressing(false);
  }, [files, quality, maxWidth, maxHeight, outputFormat]);

  const handleDownload = useCallback((file: CompressedFile) => {
    if (!file.compressedBlob) return;
    const url = URL.createObjectURL(file.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getOutputFileName(file.originalFile.name, file.compressedBlob.type);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadAll = useCallback(() => {
    const doneFiles = files.filter((f) => f.status === 'done' && f.compressedBlob);
    doneFiles.forEach((file, index) => {
      setTimeout(() => handleDownload(file), index * 300);
    });
  }, [files, handleDownload]);

  const handleClearAll = useCallback(() => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.originalPreview);
      if (f.compressedPreview) URL.revokeObjectURL(f.compressedPreview);
    });
    setFiles([]);
  }, [files]);

  const pendingCount = files.filter((f) => f.status === 'pending' || f.status === 'error').length;
  const doneCount = files.filter((f) => f.status === 'done').length;
  const hasFiles = files.length > 0;

  const totalOriginal = files.filter((f) => f.status === 'done').reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressed = files.filter((f) => f.status === 'done').reduce((sum, f) => sum + f.compressedSize, 0);
  const totalSavings = totalOriginal > 0 ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100) : 0;

  const getQualityLabel = () => {
    if (quality >= 90) return { text: 'Highest', color: 'text-green-600', bg: 'bg-green-100' };
    if (quality >= 75) return { text: 'High', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (quality >= 50) return { text: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (quality >= 25) return { text: 'Low', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'Lowest', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const ql = getQualityLabel();

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isCompressing) setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onClick={() => !isCompressing && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50 scale-[1.02] shadow-lg shadow-emerald-100'
            : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50'
        } ${isCompressing ? 'pointer-events-none opacity-50' : ''}`}
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
          <div
            className={`rounded-2xl p-4 transition-colors ${
              isDragOver
                ? 'bg-emerald-100'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50'
            }`}
          >
            <svg
              className={`h-10 w-10 transition-colors ${
                isDragOver ? 'text-emerald-600' : 'text-emerald-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">
              {isDragOver ? 'Drop your images here' : 'Drag & drop images here'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              or{' '}
              <span className="font-medium text-emerald-600 hover:text-emerald-700">
                browse files
              </span>{' '}
              from your computer
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <span className="text-xs font-medium text-slate-500">
              JPG, PNG, WebP, GIF • Multiple files supported
            </span>
          </div>
        </div>
      </div>

      {/* Settings & Files */}
      {hasFiles && (
        <div className="mt-6 space-y-4">
          {/* Compression Settings */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Quality */}
              <div className="sm:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Compression Quality
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${ql.color}`}>{ql.text}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-800">
                      {quality}%
                    </span>
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
                    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md
                    [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-500 [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              {/* Output Format */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) =>
                    setOutputFormat(e.target.value as CompressOptions['outputFormat'])
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                >
                  <option value="auto">Auto (Keep Original)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
                <p className="mt-1.5 text-[10px] text-slate-400">WebP offers best compression</p>
              </div>

              {/* Max Dimensions */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Max Dimensions
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="Width"
                      value={maxWidth || ''}
                      onChange={(e) => setMaxWidth(Number(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      W
                    </span>
                  </div>
                  <span className="flex items-center text-slate-300">×</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="Height"
                      value={maxHeight || ''}
                      onChange={(e) => setMaxHeight(Number(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      H
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">0 = no resize (keep original)</p>
              </div>
            </div>
          </div>

          {/* Summary Bar (shows when there are completed files) */}
          {doneCount > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-sm animate-fade-slide-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      {doneCount} image{doneCount !== 1 ? 's' : ''} compressed
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-600">
                      <span>{formatFileSize(totalOriginal)}</span>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="font-bold">{formatFileSize(totalCompressed)}</span>
                      {totalSavings > 0 && (
                        <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Saved {totalSavings}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {totalSavings > 0 && (
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-700">-{totalSavings}%</p>
                    <p className="text-[10px] font-medium text-emerald-500">total reduction</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{files.length}</span> file
                {files.length !== 1 ? 's' : ''}
                {doneCount > 0 && (
                  <span className="ml-2 text-emerald-600">• {doneCount} done</span>
                )}
                {pendingCount > 0 && (
                  <span className="ml-2 text-amber-600">• {pendingCount} pending</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                disabled={isCompressing}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
              >
                Clear All
              </button>
              {doneCount > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download All
                </button>
              )}
              {pendingCount > 0 && (
                <button
                  onClick={handleCompressAll}
                  disabled={isCompressing}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:opacity-60"
                >
                  {isCompressing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                      </svg>
                      Compress {pendingCount > 1 ? `All (${pendingCount})` : 'Now'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* File Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <CompressCard
                key={file.id}
                file={file}
                onRemove={handleRemove}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────── Individual File Card ────────────── */

interface CompressCardProps {
  file: CompressedFile;
  onRemove: (id: string) => void;
  onDownload: (file: CompressedFile) => void;
}

function CompressCard({ file, onRemove, onDownload }: CompressCardProps) {
  const savings =
    file.status === 'done' && file.compressedSize > 0
      ? Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100)
      : 0;

  const sizeIncreased = savings < 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(file.id)}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500"
        title="Remove"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Savings Badge */}
      {file.status === 'done' && (
        <div className="absolute left-2 top-2 z-10">
          {!sizeIncreased ? (
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              -{Math.abs(savings)}%
            </span>
          ) : (
            <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              +{Math.abs(savings)}%
            </span>
          )}
        </div>
      )}

      {/* Preview */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
        <img
          src={file.status === 'done' ? file.compressedPreview : file.originalPreview}
          alt={file.originalFile.name}
          className="max-h-full max-w-full object-contain p-2"
        />
        {file.status === 'compressing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-200 border-t-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">Compressing...</span>
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
            <span>
              {file.originalWidth}×{file.originalHeight}
            </span>
            {file.status === 'done' && file.compressedWidth > 0 && (
              <>
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span>
                  {file.compressedWidth}×{file.compressedHeight}
                </span>
              </>
            )}
          </div>
        )}

        {/* Size comparison */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span>{formatFileSize(file.originalSize)}</span>
          {file.status === 'done' && (
            <>
              <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="font-semibold text-slate-700">{formatFileSize(file.compressedSize)}</span>
            </>
          )}
        </div>

        {/* Savings bar */}
        {file.status === 'done' && !sizeIncreased && savings > 0 && (
          <div className="mt-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                style={{ width: `${Math.min(savings, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Download */}
        {file.status === 'done' && (
          <button
            onClick={() => onDownload(file)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-md active:scale-[0.98]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>
        )}

        {/* Pending Status */}
        {file.status === 'pending' && (
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-2 text-xs text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ready to compress
          </div>
        )}
      </div>
    </div>
  );
}
