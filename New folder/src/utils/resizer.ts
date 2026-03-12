export interface ResizeOptions {
  mode: 'exact' | 'percentage' | 'fit' | 'fill';
  width: number;
  height: number;
  percentage: number;
  maintainAspectRatio: boolean;
  outputFormat: 'auto' | 'jpeg' | 'png' | 'webp';
  quality: number; // 1-100
  bgColor: string;
}

export interface ResizedFile {
  id: string;
  originalFile: File;
  originalSize: number;
  originalPreview: string;
  originalWidth: number;
  originalHeight: number;
  resizedBlob: Blob | null;
  resizedSize: number;
  resizedPreview: string;
  resizedWidth: number;
  resizedHeight: number;
  status: 'pending' | 'resizing' | 'done' | 'error';
  error?: string;
}

export const PRESETS = [
  { label: 'Social Media', items: [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 851, height: 315 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'LinkedIn Banner', width: 1584, height: 396 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  ]},
  { label: 'Common Sizes', items: [
    { name: 'HD (720p)', width: 1280, height: 720 },
    { name: 'Full HD (1080p)', width: 1920, height: 1080 },
    { name: '2K', width: 2560, height: 1440 },
    { name: '4K', width: 3840, height: 2160 },
    { name: 'Icon (64×64)', width: 64, height: 64 },
    { name: 'Icon (128×128)', width: 128, height: 128 },
    { name: 'Icon (256×256)', width: 256, height: 256 },
    { name: 'Icon (512×512)', width: 512, height: 512 },
  ]},
  { label: 'Print', items: [
    { name: 'A4 (300 DPI)', width: 2480, height: 3508 },
    { name: 'A5 (300 DPI)', width: 1748, height: 2480 },
    { name: 'Letter (300 DPI)', width: 2550, height: 3300 },
    { name: '4×6 Photo', width: 1200, height: 1800 },
    { name: '5×7 Photo', width: 1500, height: 2100 },
    { name: '8×10 Photo', width: 2400, height: 3000 },
  ]},
];

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

function getOutputMimeType(file: File, outputFormat: ResizeOptions['outputFormat']): string {
  if (outputFormat === 'auto') {
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

export function getOutputFileName(originalName: string, mimeType: string, w: number, h: number): string {
  const ext = getFileExtension(mimeType);
  const baseName = originalName.replace(/\.[^.]+$/, '');
  return `${baseName}_${w}x${h}${ext}`;
}

export function calculateTargetDimensions(
  origW: number,
  origH: number,
  options: ResizeOptions
): { width: number; height: number } {
  const aspectRatio = origW / origH;

  switch (options.mode) {
    case 'percentage': {
      const scale = options.percentage / 100;
      return {
        width: Math.max(1, Math.round(origW * scale)),
        height: Math.max(1, Math.round(origH * scale)),
      };
    }
    case 'exact': {
      let w = options.width || origW;
      let h = options.height || origH;
      if (options.maintainAspectRatio) {
        if (options.width && options.height) {
          // Use width as primary, calculate height
          h = Math.round(w / aspectRatio);
        } else if (options.width) {
          h = Math.round(w / aspectRatio);
        } else if (options.height) {
          w = Math.round(h * aspectRatio);
        }
      }
      return { width: Math.max(1, w), height: Math.max(1, h) };
    }
    case 'fit': {
      let w = options.width || origW;
      let h = options.height || origH;
      const scaleW = w / origW;
      const scaleH = h / origH;
      const scale = Math.min(scaleW, scaleH);
      return {
        width: Math.max(1, Math.round(origW * scale)),
        height: Math.max(1, Math.round(origH * scale)),
      };
    }
    case 'fill': {
      let w = options.width || origW;
      let h = options.height || origH;
      return { width: Math.max(1, w), height: Math.max(1, h) };
    }
    default:
      return { width: origW, height: origH };
  }
}

export function resizeImage(
  file: File,
  options: ResizeOptions,
  origW: number,
  origH: number
): Promise<{ blob: Blob; previewUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const target = calculateTargetDimensions(origW, origH, options);
        const mimeType = getOutputMimeType(file, options.outputFormat);
        const canvas = document.createElement('canvas');

        if (options.mode === 'fill') {
          // Fill mode: canvas is target size, image is scaled to cover and centered
          canvas.width = target.width;
          canvas.height = target.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('Could not get canvas context')); return; }

          // Fill background
          ctx.fillStyle = options.bgColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Scale to cover
          const scaleW = target.width / origW;
          const scaleH = target.height / origH;
          const scale = Math.max(scaleW, scaleH);
          const drawW = origW * scale;
          const drawH = origH * scale;
          const offsetX = (target.width - drawW) / 2;
          const offsetY = (target.height - drawH) / 2;
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        } else {
          canvas.width = target.width;
          canvas.height = target.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('Could not get canvas context')); return; }

          // Fill background for JPEG
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = options.bgColor || '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0, target.width, target.height);
        }

        const qualityNorm = options.quality / 100;
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Resize failed')); return; }
            const previewUrl = URL.createObjectURL(blob);
            resolve({ blob, previewUrl, width: target.width, height: target.height });
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
