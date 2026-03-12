// ─── Background Removal Engine ────────────────────────────────────────
// Supports both AI-powered (remove.bg API) and client-side Canvas methods

// Keys loaded from environment variables — never hardcoded
const REMOVE_BG_API_KEY = import.meta.env.VITE_REMOVE_BG_API_KEY || '';
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

export interface RemoveOptions {
  tolerance: number;       // 0–100
  feathering: number;      // 0–20 px edge softness
  mode: 'ai' | 'auto' | 'manual'; // ai = remove.bg API, auto = detect from edges, manual = user picks color
  manualColor?: [number, number, number];
  connectedOnly: boolean;  // only remove bg connected to edges
  refinement: number;      // 0–100 extra edge smoothing
}

export interface RemoveResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  removedPercent: number;
}

// ── AI-powered background removal via remove.bg API ──
export async function removeBackgroundAI(file: File): Promise<RemoveResult> {
  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'auto');

  const response = await fetch(REMOVE_BG_API_URL, {
    method: 'POST',
    headers: {
      'X-Api-Key': REMOVE_BG_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg = errorData?.errors?.[0]?.title || `API error: ${response.status}`;
    throw new Error(errorMsg);
  }

  const resultBlob = await response.blob();
  const url = URL.createObjectURL(resultBlob);

  // Get dimensions and calculate removed percentage
  const { width, height, removedPercent } = await getImageStats(url);

  return {
    blob: resultBlob,
    url,
    width,
    height,
    removedPercent,
  };
}

// ── Helper: get image dimensions and transparent pixel percentage ──
function getImageStats(imageUrl: string): Promise<{ width: number; height: number; removedPercent: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height).data;
      
      let transparentPixels = 0;
      const totalPixels = img.width * img.height;
      for (let i = 0; i < totalPixels; i++) {
        if (data[i * 4 + 3] < 128) transparentPixels++;
      }
      
      resolve({
        width: img.width,
        height: img.height,
        removedPercent: Math.round((transparentPixels / totalPixels) * 100),
      });
    };
    img.onerror = () => reject(new Error('Failed to analyze result'));
    img.src = imageUrl;
  });
}

// ── Colour distance in perceptual-ish space ──
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  // Weighted Euclidean (redmean approximation)
  const rMean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(
    (2 + rMean / 256) * dr * dr +
    4 * dg * dg +
    (2 + (255 - rMean) / 256) * db * db
  );
}

// ── Sample dominant colour from edge pixels ──
function sampleEdgeColor(data: Uint8ClampedArray, w: number, h: number): [number, number, number] {
  const samples: [number, number, number][] = [];

  const addPixel = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    if (data[i + 3] > 128) { // only non-transparent
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
  };

  // Sample all 4 edges
  for (let x = 0; x < w; x++) { addPixel(x, 0); addPixel(x, h - 1); }
  for (let y = 0; y < h; y++) { addPixel(0, y); addPixel(w - 1, y); }

  // Also sample a few pixels inward on corners
  const inset = Math.min(10, Math.floor(Math.min(w, h) * 0.02));
  for (let d = 1; d <= inset; d++) {
    addPixel(d, d); addPixel(w - 1 - d, d);
    addPixel(d, h - 1 - d); addPixel(w - 1 - d, h - 1 - d);
  }

  if (samples.length === 0) return [255, 255, 255];

  // K-Means-lite: cluster into up to 4 groups, pick largest
  const clusters = kMeansLite(samples, 4, 10);
  clusters.sort((a, b) => b.count - a.count);
  return clusters[0].center;
}

interface Cluster {
  center: [number, number, number];
  count: number;
}

function kMeansLite(pixels: [number, number, number][], k: number, iterations: number): Cluster[] {
  // Initialize centers evenly spaced
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centers: [number, number, number][] = [];
  for (let i = 0; i < k; i++) {
    centers.push([...pixels[Math.min(i * step, pixels.length - 1)]]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const sums: number[][] = centers.map(() => [0, 0, 0, 0]); // r, g, b, count

    for (const px of pixels) {
      let bestD = Infinity, bestI = 0;
      for (let c = 0; c < centers.length; c++) {
        const d = colorDistance(px[0], px[1], px[2], centers[c][0], centers[c][1], centers[c][2]);
        if (d < bestD) { bestD = d; bestI = c; }
      }
      sums[bestI][0] += px[0];
      sums[bestI][1] += px[1];
      sums[bestI][2] += px[2];
      sums[bestI][3] += 1;
    }

    centers = sums.map((s, i) =>
      s[3] > 0
        ? [Math.round(s[0] / s[3]), Math.round(s[1] / s[3]), Math.round(s[2] / s[3])] as [number, number, number]
        : centers[i]
    );
  }

  // Count final assignments
  const counts = new Array(centers.length).fill(0);
  for (const px of pixels) {
    let bestD = Infinity, bestI = 0;
    for (let c = 0; c < centers.length; c++) {
      const d = colorDistance(px[0], px[1], px[2], centers[c][0], centers[c][1], centers[c][2]);
      if (d < bestD) { bestD = d; bestI = c; }
    }
    counts[bestI]++;
  }

  return centers.map((c, i) => ({ center: c, count: counts[i] }));
}

// ── Flood fill from edges ──
function floodFillFromEdges(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  bgColor: [number, number, number],
  tolerance: number
): Uint8Array {
  const mask = new Uint8Array(w * h); // 0 = keep, 1 = remove
  const visited = new Uint8Array(w * h);
  const maxDist = tolerance * 4.42; // scale 0-100 to ~0-442 (max possible distance)

  const queue: number[] = [];

  const tryEnqueue = (x: number, y: number) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const idx = y * w + x;
    if (visited[idx]) return;
    visited[idx] = 1;

    const pi = idx * 4;
    const d = colorDistance(data[pi], data[pi + 1], data[pi + 2], bgColor[0], bgColor[1], bgColor[2]);
    if (d <= maxDist) {
      mask[idx] = 1;
      queue.push(idx);
    }
  };

  // Seed from all 4 edges
  for (let x = 0; x < w; x++) { tryEnqueue(x, 0); tryEnqueue(x, h - 1); }
  for (let y = 0; y < h; y++) { tryEnqueue(0, y); tryEnqueue(w - 1, y); }

  // BFS
  while (queue.length > 0) {
    const idx = queue.shift()!;
    const x = idx % w;
    const y = Math.floor(idx / w);
    tryEnqueue(x - 1, y);
    tryEnqueue(x + 1, y);
    tryEnqueue(x, y - 1);
    tryEnqueue(x, y + 1);
  }

  return mask;
}

// ── Global threshold (non-connected) ──
function globalThreshold(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  bgColor: [number, number, number],
  tolerance: number
): Uint8Array {
  const mask = new Uint8Array(w * h);
  const maxDist = tolerance * 4.42;

  for (let i = 0; i < w * h; i++) {
    const pi = i * 4;
    const d = colorDistance(data[pi], data[pi + 1], data[pi + 2], bgColor[0], bgColor[1], bgColor[2]);
    if (d <= maxDist) {
      mask[i] = 1;
    }
  }

  return mask;
}

// ── Apply feathering to mask edges ──
function applyFeathering(mask: Uint8Array, w: number, h: number, radius: number): Float32Array {
  if (radius === 0) {
    const result = new Float32Array(w * h);
    for (let i = 0; i < mask.length; i++) result[i] = mask[i] ? 0 : 1;
    return result;
  }

  // Distance transform approximation using iterative blur on edge pixels
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < mask.length; i++) alpha[i] = mask[i] ? 0 : 1;

  // Find boundary pixels
  const boundary = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (mask[idx] !== mask[idx - 1] || mask[idx] !== mask[idx + 1] ||
          mask[idx] !== mask[idx - w] || mask[idx] !== mask[idx + w]) {
        boundary[idx] = 1;
      }
    }
  }

  // Gaussian-like feathering: compute min distance to opposite region
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!boundary[idx]) continue;

      // Apply smooth transition in radius around boundary
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const nIdx = ny * w + nx;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;

          const t = dist / radius; // 0 at boundary, 1 at edge of radius
          if (mask[idx] === 1) {
            // Background boundary pixel - fade alpha from 0 toward foreground
            if (mask[nIdx] === 0) {
              alpha[nIdx] = Math.min(alpha[nIdx], 0.5 + 0.5 * t);
            } else {
              alpha[nIdx] = Math.max(alpha[nIdx], 0.5 * (1 - t));
            }
          }
        }
      }
    }
  }

  return alpha;
}

// ── Apply refinement: morphological smoothing of mask ──
function refineMask(mask: Uint8Array, w: number, h: number, level: number): Uint8Array {
  if (level === 0) return mask;
  const iterations = Math.ceil(level / 25);
  let current = new Uint8Array(mask);

  for (let iter = 0; iter < iterations; iter++) {
    // Erode then dilate (opening) to remove noise
    const eroded = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (current[idx] && current[idx - 1] && current[idx + 1] &&
            current[idx - w] && current[idx + w]) {
          eroded[idx] = 1;
        }
      }
    }

    const dilated = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (eroded[idx] || eroded[idx - 1] || eroded[idx + 1] ||
            eroded[idx - w] || eroded[idx + w]) {
          dilated[idx] = 1;
        }
      }
    }

    current = dilated;
  }

  return current;
}

// ── Main remove background function ──
export async function removeBackground(
  imageSource: string,
  options: RemoveOptions,
  file?: File
): Promise<RemoveResult> {
  // Use AI mode via remove.bg API
  if (options.mode === 'ai' && file) {
    return removeBackgroundAI(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        // Limit processing size for performance
        const maxDim = 2048;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // Determine background color
        const bgColor: [number, number, number] = options.mode === 'manual' && options.manualColor
          ? options.manualColor
          : sampleEdgeColor(data, w, h);

        // Generate mask
        let mask: Uint8Array;
        if (options.connectedOnly) {
          mask = floodFillFromEdges(data, w, h, bgColor, options.tolerance);
        } else {
          mask = globalThreshold(data, w, h, bgColor, options.tolerance);
        }

        // Refine mask
        mask = refineMask(mask, w, h, options.refinement);

        // Apply feathering
        const alpha = applyFeathering(mask, w, h, options.feathering);

        // Apply to image data
        let removedPixels = 0;
        for (let i = 0; i < w * h; i++) {
          const newAlpha = Math.round(alpha[i] * data[i * 4 + 3]);
          if (newAlpha < data[i * 4 + 3]) removedPixels++;
          data[i * 4 + 3] = newAlpha;
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Failed to create output'));
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            width: w,
            height: h,
            removedPercent: Math.round((removedPixels / (w * h)) * 100),
          });
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSource;
  });
}

// ── Get colour at specific pixel ──
export function getColorAtPixel(
  imageSource: string,
  clickX: number,
  clickY: number,
  displayWidth: number,
  displayHeight: number
): Promise<[number, number, number]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const scaleX = img.width / displayWidth;
      const scaleY = img.height / displayHeight;
      const px = Math.round(clickX * scaleX);
      const py = Math.round(clickY * scaleY);

      const pixel = ctx.getImageData(
        Math.max(0, Math.min(px, img.width - 1)),
        Math.max(0, Math.min(py, img.height - 1)),
        1, 1
      ).data;

      resolve([pixel[0], pixel[1], pixel[2]]);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSource;
  });
}

// ── Detect background color (for preview) ──
export function detectBackgroundColor(imageSource: string): Promise<[number, number, number]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 512;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        const s = maxDim / Math.max(w, h);
        w = Math.round(w * s);
        h = Math.round(h * s);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      resolve(sampleEdgeColor(data, w, h));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSource;
  });
}
