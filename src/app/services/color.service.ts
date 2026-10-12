import { Injectable, signal, computed } from '@angular/core';

export interface ColorPalette {
  name: string;
  colors: string[];
}

export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private readonly baseHue = signal(0);
  private readonly saturation = signal(70);
  private readonly lightness = signal(50);

  readonly currentColor = computed<ColorInfo>(() => {
    return this.hslToColor(this.baseHue(), this.saturation(), this.lightness());
  });

  readonly complementary = computed<ColorInfo[]>(() => {
    const base = this.currentColor();
    return [
      base,
      this.hslToColor((base.hsl.h + 180) % 360, base.hsl.s, base.hsl.l)
    ];
  });

  readonly monochromatic = computed<ColorInfo[]>(() => {
    const base = this.currentColor();
    return [
      this.hslToColor(base.hsl.h, base.hsl.s, Math.max(10, base.hsl.l - 30)),
      this.hslToColor(base.hsl.h, base.hsl.s, Math.max(10, base.hsl.l - 15)),
      base,
      this.hslToColor(base.hsl.h, base.hsl.s, Math.min(90, base.hsl.l + 15)),
      this.hslToColor(base.hsl.h, base.hsl.s, Math.min(90, base.hsl.l + 30))
    ];
  });

  readonly analogous = computed<ColorInfo[]>(() => {
    const base = this.currentColor();
    return [
      this.hslToColor((base.hsl.h - 30 + 360) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((base.hsl.h - 15 + 360) % 360, base.hsl.s, base.hsl.l),
      base,
      this.hslToColor((base.hsl.h + 15) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((base.hsl.h + 30) % 360, base.hsl.s, base.hsl.l)
    ];
  });

  readonly triadic = computed<ColorInfo[]>(() => {
    const base = this.currentColor();
    return [
      base,
      this.hslToColor((base.hsl.h + 120) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((base.hsl.h + 240) % 360, base.hsl.s, base.hsl.l)
    ];
  });

  readonly trending2026 = computed<ColorInfo[]>(() => {
    this.lastGenerated();
    const base = this.currentColor();
    const trends = [
      { h: (base.hsl.h + 250) % 360, s: 75, l: 65 },
      { h: (base.hsl.h + 180) % 360, s: 65, l: 45 },
      { h: (base.hsl.h + 340) % 360, s: 80, l: 58 },
      { h: (base.hsl.h + 45) % 360, s: 90, l: 55 },
      { h: (base.hsl.h + 270) % 360, s: 50, l: 72 },
      { h: (base.hsl.h + 160) % 360, s: 55, l: 38 },
    ];
    return trends.map(t => this.hslToColor(t.h, t.s, t.l));
  });

  readonly tetradic = computed<ColorInfo[]>(() => {
    const base = this.currentColor();
    const h = base.hsl.h;
    return [
      base,
      this.hslToColor((h + 60) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((h + 180) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((h + 240) % 360, base.hsl.s, base.hsl.l),
    ];
  });

  readonly square = computed<ColorInfo[]>(() => {
    const base = this.currentColor();
    const h = base.hsl.h;
    return [
      base,
      this.hslToColor((h + 45) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((h + 90) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((h + 135) % 360, base.hsl.s, base.hsl.l),
      this.hslToColor((h + 180) % 360, base.hsl.s, base.hsl.l),
    ];
  });

  readonly harmony = computed<ColorInfo[]>(() => {
    const base = this.currentColor();
    const h = base.hsl.h;
    const s = base.hsl.s;
    const l = base.hsl.l;
    return [
      this.hslToColor(h, s, l),
      this.hslToColor((h + 30) % 360, s, l),
      this.hslToColor((h - 30 + 360) % 360, s, l),
      this.hslToColor((h + 180) % 360, s, l),
    ];
  });

  setBaseColor(hex: string): void {
    const rgb = this.hexToRgb(hex);
    if (rgb) {
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      this.baseHue.set(hsl.h);
      this.saturation.set(hsl.s);
      this.lightness.set(hsl.l);
    }
  }

  setRandomColor(): void {
    this.baseHue.set(Math.floor(Math.random() * 360));
    this.saturation.set(50 + Math.floor(Math.random() * 40));
    this.lightness.set(30 + Math.floor(Math.random() * 40));
    this.lastGenerated.set(Date.now());
  }

  readonly lastGenerated = signal<number>(0);

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  private hslToColor(h: number, s: number, l: number): ColorInfo {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {
      hex: this.rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
    };
  }

  getContrastRatio(hex1: string, hex2: string): number {
    const l1 = this.getLuminance(hex1);
    const l2 = this.getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  meetsWcagAA(hexBg: string, hexFg: string): boolean {
    const ratio = this.getContrastRatio(hexBg, hexFg);
    return ratio >= 4.5;
  }

  meetsWcagAAA(hexBg: string, hexFg: string): boolean {
    const ratio = this.getContrastRatio(hexBg, hexFg);
    return ratio >= 7;
  }

  getColorName(hex: string): string {
    const names: { name: string, regex: RegExp }[] = [
      { name: 'Negro', regex: /^#000000$/i },
      { name: 'Blanco', regex: /^#FFFFFF$/i },
      { name: 'Rojo', regex: /^#FF0000$/i },
      { name: 'Verde', regex: /^#00FF00$/i },
      { name: 'Azul', regex: /^#0000FF$/i },
      { name: 'Amarillo', regex: /^#FFFF00$/i },
      { name: 'Cian', regex: /^#00FFFF$/i },
      { name: 'Magenta', regex: /^#FF00FF$/i },
      { name: 'Naranja', regex: /^#FFA500$/i },
      { name: 'Purple', regex: /^#800080$/i },
    ];
    
    const colorName = names.find(item => item.regex.test(hex));
    return colorName ? colorName.name : 'Sin nombre';
  }

  setRandomColorWithVariety(): void {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 40 + Math.floor(Math.random() * 40);
    const lightness = 20 + Math.floor(Math.random() * 60);
    this.baseHue.set(hue);
    this.saturation.set(saturation);
    this.lightness.set(lightness);
    this.lastGenerated.set(Date.now());
  }
}