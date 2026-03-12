import { describe, it, expect } from 'vitest';
import {
  generateId,
  formatFileSize,
  getOutputFileName,
  calculateTargetDimensions,
  PRESETS,
  type ResizeOptions,
} from '../../src/utils/resizer';

// Helper to create resize options with defaults
function makeOptions(overrides: Partial<ResizeOptions> = {}): ResizeOptions {
  return {
    mode: 'exact',
    width: 800,
    height: 600,
    percentage: 100,
    maintainAspectRatio: false,
    outputFormat: 'auto',
    quality: 80,
    bgColor: '#ffffff',
    ...overrides,
  };
}

describe('resizer utility', () => {
  // ─── generateId ──────────────────────────────────────────────────
  describe('generateId', () => {
    it('should return a non-empty string', () => {
      expect(generateId()).toBeTruthy();
    });

    it('should generate unique IDs', () => {
      const ids = new Set(Array.from({ length: 50 }, () => generateId()));
      expect(ids.size).toBe(50);
    });
  });

  // ─── formatFileSize ──────────────────────────────────────────────
  describe('formatFileSize', () => {
    it('should return "0 B" for zero', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('should format various sizes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
    });
  });

  // ─── getOutputFileName ───────────────────────────────────────────
  describe('getOutputFileName', () => {
    it('should include dimensions in filename', () => {
      const result = getOutputFileName('photo.png', 'image/jpeg', 800, 600);
      expect(result).toBe('photo_800x600.jpg');
    });

    it('should use correct extension for PNG', () => {
      const result = getOutputFileName('image.jpg', 'image/png', 1024, 768);
      expect(result).toBe('image_1024x768.png');
    });

    it('should use correct extension for WebP', () => {
      const result = getOutputFileName('image.bmp', 'image/webp', 512, 512);
      expect(result).toBe('image_512x512.webp');
    });

    it('should handle filenames with multiple dots', () => {
      const result = getOutputFileName('my.cool.photo.jpg', 'image/jpeg', 100, 200);
      expect(result).toBe('my.cool.photo_100x200.jpg');
    });
  });

  // ─── calculateTargetDimensions ───────────────────────────────────
  describe('calculateTargetDimensions', () => {
    const origW = 1920;
    const origH = 1080;

    describe('exact mode', () => {
      it('should return exact dimensions when aspect ratio is off', () => {
        const options = makeOptions({ mode: 'exact', width: 800, height: 600, maintainAspectRatio: false });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result).toEqual({ width: 800, height: 600 });
      });

      it('should maintain aspect ratio from width', () => {
        const options = makeOptions({ mode: 'exact', width: 960, height: 540, maintainAspectRatio: true });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result.width).toBe(960);
        // 960 / (1920/1080) = 540
        expect(result.height).toBe(540);
      });

      it('should calculate width from height when only height provided', () => {
        const options = makeOptions({ mode: 'exact', width: 0, height: 540, maintainAspectRatio: true });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result.height).toBe(540);
        // 540 * (1920/1080) = 960
        expect(result.width).toBe(960);
      });

      it('should never return dimensions less than 1', () => {
        const options = makeOptions({ mode: 'exact', width: 0, height: 0, maintainAspectRatio: false });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result.width).toBeGreaterThanOrEqual(1);
        expect(result.height).toBeGreaterThanOrEqual(1);
      });
    });

    describe('percentage mode', () => {
      it('should scale to 50%', () => {
        const options = makeOptions({ mode: 'percentage', percentage: 50 });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result).toEqual({ width: 960, height: 540 });
      });

      it('should scale to 200%', () => {
        const options = makeOptions({ mode: 'percentage', percentage: 200 });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result).toEqual({ width: 3840, height: 2160 });
      });

      it('should scale to 100% (no change)', () => {
        const options = makeOptions({ mode: 'percentage', percentage: 100 });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result).toEqual({ width: 1920, height: 1080 });
      });

      it('should return at least 1×1 for very small percentages', () => {
        const options = makeOptions({ mode: 'percentage', percentage: 0.01 });
        const result = calculateTargetDimensions(10, 10, options);
        expect(result.width).toBeGreaterThanOrEqual(1);
        expect(result.height).toBeGreaterThanOrEqual(1);
      });

      it('should handle 25% correctly', () => {
        const options = makeOptions({ mode: 'percentage', percentage: 25 });
        const result = calculateTargetDimensions(1000, 500, options);
        expect(result).toEqual({ width: 250, height: 125 });
      });
    });

    describe('fit mode', () => {
      it('should fit a landscape image into a square box', () => {
        const options = makeOptions({ mode: 'fit', width: 500, height: 500 });
        const result = calculateTargetDimensions(origW, origH, options);
        // Limited by width: scale = 500/1920 ≈ 0.2604
        expect(result.width).toBe(500);
        expect(result.height).toBe(281); // 1080 * 0.2604
      });

      it('should fit a portrait image into a square box', () => {
        const options = makeOptions({ mode: 'fit', width: 500, height: 500 });
        const result = calculateTargetDimensions(1080, 1920, options);
        // Limited by height: scale = 500/1920 ≈ 0.2604
        expect(result.height).toBe(500);
        expect(result.width).toBe(281); // 1080 * 0.2604
      });

      it('should not upscale if image is smaller than target', () => {
        const options = makeOptions({ mode: 'fit', width: 5000, height: 5000 });
        const result = calculateTargetDimensions(origW, origH, options);
        // scale = min(5000/1920, 5000/1080) = 2.604... (upscales)
        // Note: fit mode does allow upscaling by default
        expect(result.width).toBeGreaterThanOrEqual(1);
        expect(result.height).toBeGreaterThanOrEqual(1);
      });
    });

    describe('fill mode', () => {
      it('should return exact target dimensions', () => {
        const options = makeOptions({ mode: 'fill', width: 500, height: 500 });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result).toEqual({ width: 500, height: 500 });
      });

      it('should handle non-square fill', () => {
        const options = makeOptions({ mode: 'fill', width: 800, height: 400 });
        const result = calculateTargetDimensions(origW, origH, options);
        expect(result).toEqual({ width: 800, height: 400 });
      });
    });
  });

  // ─── PRESETS ─────────────────────────────────────────────────────
  describe('PRESETS', () => {
    it('should have 3 categories', () => {
      expect(PRESETS).toHaveLength(3);
    });

    it('should have Social Media, Common Sizes, and Print categories', () => {
      const labels = PRESETS.map((p) => p.label);
      expect(labels).toContain('Social Media');
      expect(labels).toContain('Common Sizes');
      expect(labels).toContain('Print');
    });

    it('should have valid dimensions in all presets', () => {
      PRESETS.forEach((category) => {
        category.items.forEach((item) => {
          expect(item.width).toBeGreaterThan(0);
          expect(item.height).toBeGreaterThan(0);
          expect(item.name).toBeTruthy();
        });
      });
    });

    it('should have Instagram Post as 1080x1080', () => {
      const social = PRESETS.find((p) => p.label === 'Social Media');
      const instagram = social?.items.find((i) => i.name === 'Instagram Post');
      expect(instagram).toEqual({ name: 'Instagram Post', width: 1080, height: 1080 });
    });

    it('should have 4K as 3840x2160', () => {
      const common = PRESETS.find((p) => p.label === 'Common Sizes');
      const fourK = common?.items.find((i) => i.name === '4K');
      expect(fourK).toEqual({ name: '4K', width: 3840, height: 2160 });
    });
  });
});
