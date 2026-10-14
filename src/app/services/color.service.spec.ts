import { TestBed } from '@angular/core/testing';
import { ColorService, ColorInfo } from './color.service';

describe('ColorService', () => {
  let service: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('currentColor', () => {
    it('should return a valid ColorInfo with hex, rgb, and hsl', () => {
      const color = service.currentColor();
      expect(color).toBeDefined();
      expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(color.rgb).toEqual(jasmine.objectContaining({
        r: jasmine.any(Number),
        g: jasmine.any(Number),
        b: jasmine.any(Number)
      }));
      expect(color.hsl).toEqual(jasmine.objectContaining({
        h: jasmine.any(Number),
        s: jasmine.any(Number),
        l: jasmine.any(Number)
      }));
    });

    it('should update when setBaseColor is called', () => {
      service.setBaseColor('#ff0000');
      const color = service.currentColor();
      expect(color.hex).toBe('#ff0000');
    });
  });

  describe('setBaseColor', () => {
    it('should set the correct color from hex input', () => {
      service.setBaseColor('#00ff00');
      expect(service.currentColor().hex).toBe('#00ff00');
    });

    it('should handle hex without hash prefix', () => {
      service.setBaseColor('0000ff');
      expect(service.currentColor().hex).toBe('#0000ff');
    });

    it('should handle invalid hex gracefully', () => {
      service.setBaseColor('invalid');
      expect(service.currentColor()).toBeDefined();
    });
  });

  describe('setRandomColor', () => {
    it('should generate a valid random color', () => {
      service.setRandomColor();
      const color = service.currentColor();
      expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate different colors on multiple calls', () => {
      service.setRandomColor();
      const color1 = service.currentColor().hex;
      service.setRandomColor();
      const color2 = service.currentColor().hex;
      expect(color1).not.toBe(color2);
    });
  });

  describe('setRandomColorWithVariety', () => {
    it('should generate a valid random color with variety', () => {
      service.setRandomColorWithVariety();
      const color = service.currentColor();
      expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(color.hsl.s).toBeGreaterThanOrEqual(40);
      expect(color.hsl.s).toBeLessThanOrEqual(80);
      expect(color.hsl.l).toBeGreaterThanOrEqual(20);
      expect(color.hsl.l).toBeLessThanOrEqual(80);
    });
  });

  describe('complementary palette', () => {
    it('should return 2 colors', () => {
      service.setBaseColor('#ff0000');
      const palette = service.complementary();
      expect(palette.length).toBe(2);
    });

    it('should include the base color as first color', () => {
      service.setBaseColor('#ff0000');
      const palette = service.complementary();
      expect(palette[0].hex).toBe('#ff0000');
    });

    it('should have complementary hue (180 degrees apart)', () => {
      service.setBaseColor('#ff0000'); // Red = 0 degrees
      const palette = service.complementary();
      const baseHue = palette[0].hsl.h;
      const compHue = palette[1].hsl.h;
      expect(Math.abs(baseHue - compHue)).toBeCloseTo(180, 0);
    });
  });

  describe('monochromatic palette', () => {
    it('should return 5 colors', () => {
      const palette = service.monochromatic();
      expect(palette.length).toBe(5);
    });

    it('should have same hue for all colors', () => {
      service.setBaseColor('#ff0000');
      const palette = service.monochromatic();
      const hues = palette.map(c => c.hsl.h);
      hues.forEach(h => expect(h).toBe(hues[0]));
    });

    it('should have varying lightness values', () => {
      const palette = service.monochromatic();
      const lightness = palette.map(c => c.hsl.l);
      const unique = new Set(lightness);
      expect(unique.size).toBeGreaterThan(1);
    });
  });

  describe('analogous palette', () => {
    it('should return 5 colors', () => {
      const palette = service.analogous();
      expect(palette.length).toBe(5);
    });

    it('should have hues within 60 degrees range', () => {
      service.setBaseColor('#ff0000');
      const palette = service.analogous();
      const hues = palette.map(c => c.hsl.h).sort((a, b) => a - b);
      // Calculate circular range: max gap between consecutive hues (including wrap-around)
      let maxGap = 0;
      for (let i = 0; i < hues.length; i++) {
        const current = hues[i];
        const next = hues[(i + 1) % hues.length];
        const gap = (next - current + 360) % 360;
        maxGap = Math.max(maxGap, gap);
      }
      const circularRange = 360 - maxGap;
      expect(circularRange).toBeLessThanOrEqual(60);
    });
  });

  describe('triadic palette', () => {
    it('should return 3 colors', () => {
      const palette = service.triadic();
      expect(palette.length).toBe(3);
    });

    it('should have hues 120 degrees apart', () => {
      service.setBaseColor('#ff0000');
      const palette = service.triadic();
      const hues = palette.map(c => c.hsl.h);
      expect(hues[1]).toBeCloseTo(120, 0);
      expect(hues[2]).toBeCloseTo(240, 0);
    });
  });

  describe('tetradic palette', () => {
    it('should return 4 colors', () => {
      const palette = service.tetradic();
      expect(palette.length).toBe(4);
    });

    it('should have hues at 60, 180, 240 degrees', () => {
      service.setBaseColor('#ff0000');
      const palette = service.tetradic();
      const hues = palette.map(c => c.hsl.h);
      expect(hues[1]).toBeCloseTo(60, 0);
      expect(hues[2]).toBeCloseTo(180, 0);
      expect(hues[3]).toBeCloseTo(240, 0);
    });
  });

  describe('square palette', () => {
    it('should return 5 colors', () => {
      const palette = service.square();
      expect(palette.length).toBe(5);
    });

    it('should have hues at 45, 90, 135, 180 degrees', () => {
      service.setBaseColor('#ff0000');
      const palette = service.square();
      const hues = palette.map(c => c.hsl.h);
      expect(hues[1]).toBeCloseTo(45, 0);
      expect(hues[2]).toBeCloseTo(90, 0);
      expect(hues[3]).toBeCloseTo(135, 0);
      expect(hues[4]).toBeCloseTo(180, 0);
    });
  });

  describe('harmony palette', () => {
    it('should return 4 colors', () => {
      const palette = service.harmony();
      expect(palette.length).toBe(4);
    });
  });

  describe('trending2026 palette', () => {
    it('should return 6 colors', () => {
      const palette = service.trending2026();
      expect(palette.length).toBe(6);
    });
  });

  describe('contrast ratio', () => {
    it('should return 21 for white on black', () => {
      const ratio = service.getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should return 1 for same colors', () => {
      const ratio = service.getContrastRatio('#ff0000', '#ff0000');
      expect(ratio).toBe(1);
    });
  });

  describe('WCAG compliance', () => {
    it('should pass AA for black text on white', () => {
      expect(service.meetsWcagAA('#ffffff', '#000000')).toBeTrue();
    });

    it('should fail AA for white text on white', () => {
      expect(service.meetsWcagAA('#ffffff', '#ffffff')).toBeFalse();
    });

    it('should pass AAA for black text on white', () => {
      expect(service.meetsWcagAAA('#ffffff', '#000000')).toBeTrue();
    });

    it('should fail AAA for gray text on white', () => {
      expect(service.meetsWcagAAA('#ffffff', '#767676')).toBeFalse();
    });
  });

  describe('getColorName', () => {
    it('should return black for #000000', () => {
      expect(service.getColorName('#000000')).toBe('black');
    });

    it('should return white for #FFFFFF', () => {
      expect(service.getColorName('#FFFFFF')).toBe('white');
    });

    it('should return red for #FF0000', () => {
      expect(service.getColorName('#FF0000')).toBe('red');
    });

    it('should return unknown for unknown colors', () => {
      expect(service.getColorName('#123456')).toBe('unknown');
    });
  });

  describe('color conversion utilities', () => {
    it('should convert hex to rgb correctly', () => {
      const rgb = (service as any).hexToRgb('#ff8800');
      expect(rgb).toEqual({ r: 255, g: 136, b: 0 });
    });

    it('should convert rgb to hex correctly', () => {
      const hex = (service as any).rgbToHex(255, 136, 0);
      expect(hex).toBe('#ff8800');
    });

    it('should convert rgb to hsl correctly', () => {
      const hsl = (service as any).rgbToHsl(255, 0, 0);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    it('should convert hsl to ColorInfo correctly', () => {
      const color = (service as any).hslToColor(0, 100, 50);
      expect(color.hex).toBe('#ff0000');
    });
  });
});