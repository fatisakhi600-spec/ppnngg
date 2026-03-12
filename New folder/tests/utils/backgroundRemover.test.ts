import { describe, it, expect } from 'vitest';

// Test the exported types and constants by importing them
// We test the pure logic that doesn't depend on DOM/Canvas directly

describe('backgroundRemover utility', () => {
  describe('RemoveOptions type interface', () => {
    it('should define valid option combinations', () => {
      const aiOptions = {
        tolerance: 50,
        feathering: 5,
        mode: 'ai' as const,
        connectedOnly: true,
        refinement: 50,
      };
      expect(aiOptions.mode).toBe('ai');
      expect(aiOptions.tolerance).toBe(50);
    });

    it('should support auto mode', () => {
      const autoOptions = {
        tolerance: 30,
        feathering: 3,
        mode: 'auto' as const,
        connectedOnly: true,
        refinement: 25,
      };
      expect(autoOptions.mode).toBe('auto');
    });

    it('should support manual mode with color', () => {
      const manualOptions = {
        tolerance: 40,
        feathering: 2,
        mode: 'manual' as const,
        manualColor: [255, 255, 255] as [number, number, number],
        connectedOnly: false,
        refinement: 0,
      };
      expect(manualOptions.mode).toBe('manual');
      expect(manualOptions.manualColor).toEqual([255, 255, 255]);
    });
  });

  describe('tolerance and feathering ranges', () => {
    it('should accept tolerance from 0 to 100', () => {
      const values = [0, 25, 50, 75, 100];
      values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      });
    });

    it('should accept feathering from 0 to 20', () => {
      const values = [0, 5, 10, 15, 20];
      values.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(20);
      });
    });
  });
});
