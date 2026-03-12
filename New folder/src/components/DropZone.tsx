import { useCallback, useState, useRef } from 'react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const pngFiles = Array.from(fileList).filter(
        (f) => f.type === 'image/png'
      );
      if (pngFiles.length > 0) {
        onFilesSelected(pngFiles);
      }
    },
    [onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300
        ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-100'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        }
        ${disabled ? 'pointer-events-none opacity-50' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <div className="flex flex-col items-center gap-4">
        <div
          className={`rounded-2xl p-4 transition-colors ${
            isDragOver ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          }`}
        >
          <svg
            className={`h-10 w-10 transition-colors ${
              isDragOver ? 'text-blue-600' : 'text-blue-500'
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
            {isDragOver ? 'Drop your PNG files here' : 'Drag & drop PNG files here'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            or <span className="font-medium text-blue-600 hover:text-blue-700">browse files</span> from your computer
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <span className="text-xs font-medium text-slate-500">PNG files only • Multiple files supported</span>
        </div>
      </div>
    </div>
  );
}
