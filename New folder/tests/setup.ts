/// <reference types="vitest" />
import '@testing-library/jest-dom';

// Mock Canvas API for JSDOM environment
class MockCanvasRenderingContext2D {
  canvas = { width: 100, height: 100 };
  fillStyle = '#000000';
  strokeStyle = '#000000';
  lineWidth = 1;
  font = '10px sans-serif';
  textAlign = 'start' as CanvasTextAlign;
  textBaseline = 'alphabetic' as CanvasTextBaseline;
  globalAlpha = 1;
  globalCompositeOperation = 'source-over' as GlobalCompositeOperation;

  fillRect() {}
  clearRect() {}
  strokeRect() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  fill() {}
  stroke() {}
  clip() {}
  save() {}
  restore() {}
  scale() {}
  rotate() {}
  translate() {}
  transform() {}
  setTransform() {}
  resetTransform() {}
  measureText(text: string) {
    return { width: text.length * 7 } as TextMetrics;
  }
  drawImage() {}

  getImageData(sx: number, sy: number, sw: number, sh: number) {
    const data = new Uint8ClampedArray(sw * sh * 4);
    // Fill with white pixels (RGBA: 255, 255, 255, 255)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A
    }
    return { data, width: sw, height: sh };
  }

  putImageData() {}
  createLinearGradient() {
    return { addColorStop() {} };
  }
  createRadialGradient() {
    return { addColorStop() {} };
  }
  createPattern() {
    return {};
  }
}

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = function (contextId: string) {
  if (contextId === '2d') {
    const ctx = new MockCanvasRenderingContext2D();
    ctx.canvas = this as unknown as { width: number; height: number };
    return ctx as unknown as CanvasRenderingContext2D;
  }
  return null;
} as typeof HTMLCanvasElement.prototype.getContext;

// Mock HTMLCanvasElement.toBlob
HTMLCanvasElement.prototype.toBlob = function (
  callback: BlobCallback,
  type?: string,
  _quality?: number
) {
  const blob = new Blob(['mock-image-data'], { type: type || 'image/png' });
  setTimeout(() => callback(blob), 0);
};

// Mock HTMLCanvasElement.toDataURL
HTMLCanvasElement.prototype.toDataURL = function (type?: string) {
  return `data:${type || 'image/png'};base64,mockBase64Data`;
};

// Mock URL.createObjectURL / revokeObjectURL
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = (_blob: Blob) => `blob:mock-url-${Math.random().toString(36).slice(2)}`;
}
if (typeof URL.revokeObjectURL === 'undefined') {
  URL.revokeObjectURL = () => {};
}

// Mock Image with load event
class MockImage extends EventTarget {
  private _src = '';
  width = 100;
  height = 100;
  crossOrigin: string | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  get src() {
    return this._src;
  }
  set src(value: string) {
    this._src = value;
    // Simulate async image load
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 10);
  }
}

// @ts-expect-error - overriding global Image for testing
global.Image = MockImage;
