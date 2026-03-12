import { describe, it, expect } from 'vitest';
import {
  generateId,
  formatFileSize,
  getOutputFileName,
} from '../../src/utils/compressor';

describe('compressor utility', () => {
  // ─── generateId ──────────────────────────────────────────────────
  describe('generateId', () => {
    it('should return a non-empty string', () => {
      const id = generateId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 50; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(50);
    });
  });

  // ─── formatFileSize ──────────────────────────────────────────────
  describe('formatFileSize', () => {
    it('should return "0 B" for zero', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('should format bytes', () => {
      expect(formatFileSize(512)).toBe('512 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(10240)).toBe('10 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(5242880)).toBe('5 MB');
    });
  });

  // ─── getOutputFileName ───────────────────────────────────────────
  describe('getOutputFileName', () => {
    it('should append _compressed and correct extension for JPEG', () => {
      const result = getOutputFileName('photo.png', 'image/jpeg');
      expect(result).toBe('photo_compressed.jpg');
    });

    it('should keep PNG extension when output is PNG', () => {
      const result = getOutputFileName('photo.png', 'image/png');
      expect(result).toBe('photo_compressed.png');
    });

    it('should use WebP extension', () => {
      const result = getOutputFileName('photo.jpg', 'image/webp');
      expect(result).toBe('photo_compressed.webp');
    });

    it('should handle filenames with multiple dots', () => {
      const result = getOutputFileName('my.awesome.photo.png', 'image/jpeg');
      expect(result).toBe('my.awesome.photo_compressed.jpg');
    });

    it('should handle filenames without extension', () => {
      const result = getOutputFileName('noextension', 'image/png');
      expect(result).toBe('noextension_compressed.png');
    });

    it('should default to .jpg for unknown mime types', () => {
      const result = getOutputFileName('file.bmp', 'image/bmp');
      expect(result).toBe('file_compressed.jpg');
    });
  });
});
