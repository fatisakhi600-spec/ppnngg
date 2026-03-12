import { describe, it, expect } from 'vitest';
import {
  MODELS,
  STYLE_PRESETS,
  DIMENSION_PRESETS,
} from '../../src/utils/textToImage';

describe('textToImage utility', () => {
  // ─── MODELS ──────────────────────────────────────────────────────
  describe('MODELS', () => {
    it('should have at least 1 model', () => {
      expect(MODELS.length).toBeGreaterThan(0);
    });

    it('should have all required fields on each model', () => {
      MODELS.forEach((model) => {
        expect(model.id).toBeTruthy();
        expect(model.name).toBeTruthy();
        expect(model.shortName).toBeTruthy();
        expect(model.description).toBeTruthy();
        expect(model.icon).toBeTruthy();
        expect(model.defaultSteps).toBeGreaterThan(0);
        expect(model.defaultGuidance).toBeGreaterThanOrEqual(0);
        expect(model.maxWidth).toBeGreaterThan(0);
        expect(model.maxHeight).toBeGreaterThan(0);
        expect(model.category).toBeTruthy();
      });
    });

    it('should include SDXL model', () => {
      const sdxl = MODELS.find((m) => m.id.includes('stable-diffusion-xl'));
      expect(sdxl).toBeDefined();
      expect(sdxl!.maxWidth).toBe(1024);
      expect(sdxl!.maxHeight).toBe(1024);
    });

    it('should include FLUX.1 Schnell model', () => {
      const flux = MODELS.find((m) => m.id.includes('FLUX.1-schnell'));
      expect(flux).toBeDefined();
      expect(flux!.defaultSteps).toBeLessThanOrEqual(5); // Fast model
    });

    it('should have unique model IDs', () => {
      const ids = new Set(MODELS.map((m) => m.id));
      expect(ids.size).toBe(MODELS.length);
    });
  });

  // ─── STYLE_PRESETS ───────────────────────────────────────────────
  describe('STYLE_PRESETS', () => {
    it('should have at least 2 presets', () => {
      expect(STYLE_PRESETS.length).toBeGreaterThan(1);
    });

    it('should have "None" as the first preset', () => {
      expect(STYLE_PRESETS[0].name).toBe('None');
      expect(STYLE_PRESETS[0].prefix).toBe('');
      expect(STYLE_PRESETS[0].suffix).toBe('');
    });

    it('should have all required fields', () => {
      STYLE_PRESETS.forEach((preset) => {
        expect(preset.name).toBeTruthy();
        expect(typeof preset.prefix).toBe('string');
        expect(typeof preset.suffix).toBe('string');
      });
    });

    it('should have unique names', () => {
      const names = new Set(STYLE_PRESETS.map((p) => p.name));
      expect(names.size).toBe(STYLE_PRESETS.length);
    });

    it('should include common styles', () => {
      const names = STYLE_PRESETS.map((p) => p.name);
      expect(names).toContain('Photorealistic');
      expect(names).toContain('Anime');
      expect(names).toContain('Digital Art');
    });
  });

  // ─── DIMENSION_PRESETS ───────────────────────────────────────────
  describe('DIMENSION_PRESETS', () => {
    it('should have at least 4 presets', () => {
      expect(DIMENSION_PRESETS.length).toBeGreaterThanOrEqual(4);
    });

    it('should have valid dimensions', () => {
      DIMENSION_PRESETS.forEach((preset) => {
        expect(preset.width).toBeGreaterThan(0);
        expect(preset.height).toBeGreaterThan(0);
        expect(preset.name).toBeTruthy();
        expect(preset.label).toBeTruthy();
      });
    });

    it('should include Square preset', () => {
      const square = DIMENSION_PRESETS.find((d) => d.name === 'Square');
      expect(square).toBeDefined();
      expect(square!.width).toBe(square!.height);
    });

    it('should include Portrait preset', () => {
      const portrait = DIMENSION_PRESETS.find((d) => d.name === 'Portrait');
      expect(portrait).toBeDefined();
      expect(portrait!.height).toBeGreaterThan(portrait!.width);
    });

    it('should include Landscape preset', () => {
      const landscape = DIMENSION_PRESETS.find((d) => d.name === 'Landscape');
      expect(landscape).toBeDefined();
      expect(landscape!.width).toBeGreaterThan(landscape!.height);
    });

    it('should have labels matching dimensions format', () => {
      DIMENSION_PRESETS.forEach((preset) => {
        expect(preset.label).toContain('×');
        expect(preset.label).toBe(`${preset.width}×${preset.height}`);
      });
    });
  });
});
