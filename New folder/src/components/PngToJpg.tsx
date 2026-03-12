import { useState, useCallback } from 'react';
import { DropZone } from './DropZone';
import { QualitySlider } from './QualitySlider';
import { FileCard } from './FileCard';
import { ConvertedFile } from '../types';
import { convertPngToJpg, generateId } from '../utils/converter';

export function PngToJpg() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [quality, setQuality] = useState(85);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isConverting, setIsConverting] = useState(false);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const newFiles: ConvertedFile[] = selectedFiles.map((file) => ({
      id: generateId(),
      originalFile: file,
      originalSize: file.size,
      originalPreview: URL.createObjectURL(file),
      convertedBlob: null,
      convertedSize: 0,
      convertedPreview: '',
      status: 'pending' as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.originalPreview);
        if (file.convertedPreview) URL.revokeObjectURL(file.convertedPreview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleConvertAll = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) return;

    setIsConverting(true);

    for (const file of pendingFiles) {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: 'converting' as const } : f))
      );

      try {
        const { blob, previewUrl } = await convertPngToJpg(file.originalFile, quality, bgColor);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  convertedBlob: blob,
                  convertedSize: blob.size,
                  convertedPreview: previewUrl,
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
                  error: err instanceof Error ? err.message : 'Unknown error',
                }
              : f
          )
        );
      }
    }

    setIsConverting(false);
  }, [files, quality, bgColor]);

  const handleDownloadAll = useCallback(() => {
    const doneFiles = files.filter((f) => f.status === 'done' && f.convertedBlob);
    doneFiles.forEach((file, index) => {
      setTimeout(() => {
        if (!file.convertedBlob) return;
        const url = URL.createObjectURL(file.convertedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.originalFile.name.replace(/\.png$/i, '.jpg');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 300);
    });
  }, [files]);

  const handleClearAll = useCallback(() => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.originalPreview);
      if (f.convertedPreview) URL.revokeObjectURL(f.convertedPreview);
    });
    setFiles([]);
  }, [files]);

  const pendingCount = files.filter((f) => f.status === 'pending' || f.status === 'error').length;
  const doneCount = files.filter((f) => f.status === 'done').length;
  const hasFiles = files.length > 0;

  return (
    <div>
      {/* Drop Zone */}
      <DropZone onFilesSelected={handleFilesSelected} disabled={isConverting} />

      {/* Settings & Actions */}
      {hasFiles && (
        <div className="mt-6 space-y-4">
          <QualitySlider
            quality={quality}
            onChange={setQuality}
            bgColor={bgColor}
            onBgColorChange={setBgColor}
          />

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{files.length}</span> file
                {files.length !== 1 ? 's' : ''}
                {doneCount > 0 && (
                  <span className="ml-2 text-green-600">• {doneCount} converted</span>
                )}
                {pendingCount > 0 && (
                  <span className="ml-2 text-amber-600">• {pendingCount} pending</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                disabled={isConverting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
              >
                Clear All
              </button>
              {doneCount > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download All
                </button>
              )}
              {pendingCount > 0 && (
                <button
                  onClick={handleConvertAll}
                  disabled={isConverting}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:opacity-60"
                >
                  {isConverting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
                      </svg>
                      Convert {pendingCount > 1 ? `All (${pendingCount})` : 'Now'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* File Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <FileCard key={file.id} file={file} onRemove={handleRemove} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
