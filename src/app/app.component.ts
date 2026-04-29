import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorService, ColorInfo } from './services/color.service';

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

  readonly currentColor = this.colorService.currentColor;
  readonly selectedPalette = signal<string>('monochromatic');

  readonly paletteType = signal<PaletteOption[]>([
    { id: 'complementary', name: 'Complementario', icon: '⚖️' },
    { id: 'monochromatic', name: 'Monocromática', icon: '📊' },
    { id: 'analogous', name: 'Análoga', icon: '🌈' },
    { id: 'triadic', name: 'Triádica', icon: '🔺' },
    { id: 'trending', name: 'Tendencia 2026', icon: '🔥' }
  ]);

  readonly currentPaletteColors = computed<ColorInfo[]>(() => {
    const type = this.selectedPalette();
    switch (type) {
      case 'complementary': return this.colorService.complementary();
      case 'monochromatic': return this.colorService.monochromatic();
      case 'analogous': return this.colorService.analogous();
      case 'triadic': return this.colorService.triadic();
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

  constructor() {
    this.colorService.setRandomColor();
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

  generateRandom(): void {
    this.colorService.setRandomColor();
  }
}