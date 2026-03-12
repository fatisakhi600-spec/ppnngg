import { describe, it, expect } from 'vitest';
import { formatFileSize, generateId } from '../../src/utils/converter';

describe('converter utility', () => {
  // ─── formatFileSize ──────────────────────────────────────────────
  describe('formatFileSize', () => {
    it('should return "0 B" for 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });

    it('should format gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle small decimal values', () => {
      expect(formatFileSize(100)).toBe('100 B');
      expect(formatFileSize(1500)).toBe('1.5 KB');
    });
  });

  // ─── generateId ──────────────────────────────────────────────────
  describe('generateId', () => {
    it('should return a non-empty string', () => {
      const id = generateId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('should return unique values', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('should return alphanumeric strings', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });
});
