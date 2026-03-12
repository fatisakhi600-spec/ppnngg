import { ConvertedFile } from '../types';
import { formatFileSize } from '../utils/converter';

interface FileCardProps {
  file: ConvertedFile;
  onRemove: (id: string) => void;
}

export function FileCard({ file, onRemove }: FileCardProps) {
  const savings =
    file.status === 'done' && file.convertedSize > 0
      ? Math.round(((file.originalSize - file.convertedSize) / file.originalSize) * 100)
      : 0;

  const handleDownload = () => {
    if (!file.convertedBlob) return;
    const url = URL.createObjectURL(file.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.originalFile.name.replace(/\.png$/i, '.jpg');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Remove button */}
      <button
        onClick={() => onRemove(file.id)}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500"
        title="Remove"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Preview */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
        <img
          src={file.status === 'done' ? file.convertedPreview : file.originalPreview}
          alt={file.originalFile.name}
          className="max-h-full max-w-full object-contain p-2"
        />
        {file.status === 'converting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-200 border-t-blue-600" />
              <span className="text-xs font-medium text-blue-600">Converting...</span>
            </div>
          </div>
        )}
        {file.status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1 text-center px-4">
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
          {file.originalFile.name.replace(/\.png$/i, '.jpg')}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{formatFileSize(file.originalSize)}</span>
            {file.status === 'done' && (
              <>
                <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span className="font-semibold text-slate-700">{formatFileSize(file.convertedSize)}</span>
                {savings > 0 && (
                  <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    -{savings}%
                  </span>
                )}
                {savings < 0 && (
                  <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                    +{Math.abs(savings)}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {file.status === 'done' && (
          <button
            onClick={handleDownload}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md active:scale-[0.98]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download JPG
          </button>
        )}
      </div>
    </div>
  );
}
