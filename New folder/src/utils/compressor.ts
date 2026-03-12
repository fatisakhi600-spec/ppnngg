export interface CompressOptions {
  quality: number; // 1-100
  maxWidth: number; // 0 = no resize
  maxHeight: number; // 0 = no resize
  outputFormat: 'auto' | 'jpeg' | 'png' | 'webp';
}

export interface CompressedFile {
  id: string;
  originalFile: File;
  originalSize: number;
  originalPreview: string;
  originalWidth: number;
  originalHeight: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedPreview: string;
  compressedWidth: number;
  compressedHeight: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getOutputMimeType(file: File, outputFormat: CompressOptions['outputFormat']): string {
  if (outputFormat === 'auto') {
    // For auto, convert to JPEG for photos, keep PNG for transparency, use WebP if already WebP
    if (file.type === 'image/png') return 'image/png';
    if (file.type === 'image/webp') return 'image/webp';
    if (file.type === 'image/gif') return 'image/gif';
    return 'image/jpeg';
  }
  return `image/${outputFormat}`;
}

function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return map[mimeType] || '.jpg';
}

export function getOutputFileName(originalName: string, mimeType: string): string {
  const ext = getFileExtension(mimeType);
  const baseName = originalName.replace(/\.[^.]+$/, '');
  return `${baseName}_compressed${ext}`;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

export function compressImage(
  file: File,
  options: CompressOptions
): Promise<{ blob: Blob; previewUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        let targetWidth = img.naturalWidth;
        let targetHeight = img.naturalHeight;

        // Resize if needed
        if (options.maxWidth > 0 && targetWidth > options.maxWidth) {
          const ratio = options.maxWidth / targetWidth;
          targetWidth = options.maxWidth;
          targetHeight = Math.round(targetHeight * ratio);
        }
        if (options.maxHeight > 0 && targetHeight > options.maxHeight) {
          const ratio = options.maxHeight / targetHeight;
          targetHeight = options.maxHeight;
          targetWidth = Math.round(targetWidth * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        const mimeType = getOutputMimeType(file, options.outputFormat);

        // Fill background for JPEG (no transparency support)
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const qualityNorm = options.quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }
            const previewUrl = URL.createObjectURL(blob);
            resolve({ blob, previewUrl, width: targetWidth, height: targetHeight });
          },
          mimeType,
          qualityNorm
        );
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
