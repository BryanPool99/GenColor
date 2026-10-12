import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorService, ColorInfo } from '../services/color.service';

export interface PaletteOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-palette-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      @for (option of paletteOptions(); track option.id) {
        <button
          type="button"
          (click)="select(option.id)"
          [class.ring-2]="selected() === option.id"
          [class.ring-blue-500]="selected() === option.id"
          [class.bg-blue-50]="selected() === option.id"
          [class.text-blue-700]="selected() === option.id"
          [class.bg-gray-50]="selected() !== option.id"
          [class.text-gray-600]="selected() !== option.id"
          [class.hover:bg-gray-100]="selected() !== option.id"
          class="p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <span class="text-xl">{{ option.icon }}</span>
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ option.name }}</span>
            <span class="text-xs text-gray-400">{{ option.description }}</span>
          </div>
        </button>
      }
    </div>
  `
})
export class PaletteSelectorComponent {
  private colorService = inject(ColorService);

  @Input({ required: true }) selected!: string;
  @Output() selectionChange = new EventEmitter<string>();

  readonly paletteOptions = signal<PaletteOption[]>([
    { id: 'monochromatic', name: 'Monocromática', icon: '📊', description: 'Variaciones de un solo tono' },
    { id: 'complementary', name: 'Complementario', icon: '⚖️', description: 'Colores opuestos en la rueda' },
    { id: 'analogous', name: 'Análoga', icon: '🌈', description: 'Colores adyacentes armoniosos' },
    { id: 'triadic', name: 'Tríádica', icon: '🔺', description: 'Tres colores equidistantes' },
    { id: 'tetradic', name: 'Tetrádica', icon: '🟦', description: 'Cuatro colores en rectángulo' },
    { id: 'square', name: 'Cuadrada', icon: '⬜', description: 'Cuatro colores en cuadrado' },
    { id: 'harmony', name: 'Armonía', icon: '🎵', description: 'Analógicos + complementario' },
    { id: 'trending', name: 'Tendencia 2026', icon: '🔥', description: 'Colores de moda del año' },
  ]);

  select(id: string): void {
    this.selectionChange.emit(id);
  }
}