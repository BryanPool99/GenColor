import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorService, ColorInfo } from './services/color.service';
import { ThemeService, Theme } from './services/theme.service';

interface PaletteOption {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private colorService = inject(ColorService);
  private themeService = inject(ThemeService);

  readonly currentColor = this.colorService.currentColor;
  readonly selectedPalette = signal<string>('monochromatic');
  readonly theme = this.themeService.theme;
  readonly isDark = this.themeService.isDark;

  getPaletteButtonClass(paletteId: string): Record<string, boolean> {
    const isSelected = this.selectedPalette() === paletteId;
    const dark = this.isDark();
    return {
      'bg-blue-50': isSelected && !dark,
      'border-blue-500': isSelected && !dark,
      'text-blue-700': isSelected && !dark,
      'dark:bg-blue-900/30': isSelected && dark,
      'dark:border-blue-500': isSelected && dark,
      'dark:text-blue-300': isSelected && dark,
      'bg-gray-50': !isSelected && !dark,
      'border-gray-200': !isSelected && !dark,
      'text-gray-600': !isSelected && !dark,
      'dark:bg-slate-700/50': !isSelected && dark,
      'dark:border-slate-600': !isSelected && dark,
      'dark:text-slate-300': !isSelected && dark,
      'hover:bg-gray-100': !isSelected && !dark,
      'dark:hover:bg-slate-700': !isSelected && dark,
      'border': true,
    };
  }

  getContrastBadgeClass(passesAA: boolean, passesAAA: boolean): Record<string, boolean> {
    const dark = this.isDark();
    return {
      'bg-green-100': passesAA && !dark,
      'text-green-700': passesAA && !dark,
      'bg-red-100': !passesAA && !dark,
      'text-red-700': !passesAA && !dark,
      'dark:bg-green-900/30': passesAA && dark,
      'dark:text-green-400': passesAA && dark,
      'dark:bg-red-900/30': !passesAA && dark,
      'dark:text-red-400': !passesAA && dark,
    };
  }

  readonly paletteType = signal<PaletteOption[]>([
    { id: 'complementary', name: 'Complementario', icon: '⚖️' },
    { id: 'monochromatic', name: 'Monocromática', icon: '📊' },
    { id: 'analogous', name: 'Análoga', icon: '🌈' },
    { id: 'triadic', name: 'Tríádica', icon: '🔺' },
    { id: 'tetradic', name: 'Tetrádica', icon: '🟦' },
    { id: 'square', name: 'Cuadrada', icon: '⬜' },
    { id: 'harmony', name: 'Armonía', icon: '🎵' },
    { id: 'trending', name: 'Tendencia 2026', icon: '🔥' }
  ]);

  readonly currentPaletteColors = computed<ColorInfo[]>(() => {
    const type = this.selectedPalette();
    switch (type) {
      case 'complementary': return this.colorService.complementary();
      case 'monochromatic': return this.colorService.monochromatic();
      case 'analogous': return this.colorService.analogous();
      case 'triadic': return this.colorService.triadic();
      case 'tetradic': return this.colorService.tetradic();
      case 'square': return this.colorService.square();
      case 'harmony': return this.colorService.harmony();
      case 'trending': return this.colorService.trending2026();
      default: return this.colorService.monochromatic();
    }
  });

  readonly previewColors = computed(() => {
    const colors = this.currentPaletteColors();
    return {
      bg: colors[0]?.hex || '#ffffff',
      surface: colors[1]?.hex || '#f3f4f6',
      primary: colors[2]?.hex || '#3b82f6',
      accent: colors[3]?.hex || '#8b5cf6',
      text: colors[4]?.hex || '#1f2937'
    };
  });

  readonly contrastWhite = computed(() => {
    const bg = this.currentColor().hex;
    return {
      ratio: this.colorService.getContrastRatio(bg, '#ffffff'),
      passesAA: this.colorService.meetsWcagAA(bg, '#ffffff'),
      passesAAA: this.colorService.meetsWcagAAA(bg, '#ffffff')
    };
  });

  readonly contrastBlack = computed(() => {
    const bg = this.currentColor().hex;
    return {
      ratio: this.colorService.getContrastRatio(bg, '#000000'),
      passesAA: this.colorService.meetsWcagAA(bg, '#000000'),
      passesAAA: this.colorService.meetsWcagAAA(bg, '#000000')
    };
  });

  readonly copiedColor = signal<string | null>(null);
  readonly favorites = signal<Record<string, ColorInfo>>({});

  constructor() {
    this.colorService.setRandomColor();
    this.loadFavorites();
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
    this.colorService.setRandomColorWithVariety();
  }

  loadFavorites(): void {
    const stored = localStorage.getItem('color-palette-favorites');
    if (stored) {
      try {
        this.favorites.set(JSON.parse(stored));
      } catch {
        this.favorites.set({});
      }
    }
  }

  isFavorite(hex: string): boolean {
    return hex in this.favorites();
  }

  favoriteColors(): ColorInfo[] {
    return Object.values(this.favorites());
  }

  handleCopy(): void {
    const color = this.currentPaletteColors()[0];
    if (color) {
      this.copyToClipboard(color.hex);
    }
  }

  onPaletteSelection(id: string): void {
    this.selectedPalette.set(id);
  }

  generateJSONExport(): void {
    const colors = this.currentPaletteColors();
    const data = {
      palette: {
        type: this.selectedPalette(),
        colors: colors.map(c => ({ hex: c.hex, hsl: c.hsl, name: this.getColorName(c.hex) }))
      },
      metadata: {
        count: colors.length,
        generatedAt: new Date().toISOString()
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${this.selectedPalette()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getFavoriteCount(): number {
    return Object.keys(this.favorites()).length;
  }

  toggleFavorite(hex: string): void {
    const current = this.favorites();
    const newFavs = { ...current };
    if (hex in newFavs) {
      delete newFavs[hex];
    } else {
      const color = this.currentPaletteColors().find(c => c.hex === hex);
      if (color) {
        newFavs[hex] = color;
      }
    }
    this.favorites.set(newFavs);
    localStorage.setItem('color-palette-favorites', JSON.stringify(newFavs));
  }

  onColorInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.colorService.setBaseColor(input.value);
  }

  onHueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.colorService.setBaseColor(input.value);
  }

  selectPalette(id: string): void {
    this.selectedPalette.set(id);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async copyToClipboard(hex: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(hex);
      this.copiedColor.set(hex);
      setTimeout(() => this.copiedColor.set(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  isCopied(hex: string): boolean {
    return this.copiedColor() === hex;
  }
}
