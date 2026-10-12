import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { ColorInfo } from '../services/color.service';
import { ColorSwatchComponent } from './color-swatch.component';

@Component({
  selector: 'app-color-palette',
  standalone: true,
  imports: [ColorSwatchComponent],
  template: `
    <div class="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      @for (color of colors(); track color.hex; let i = $index) {
        <app-color-swatch
          [color]="color"
          (copy)="handleCopy(color)"
        ></app-color-swatch>
      }
    </div>
  `
})
export class ColorPaletteComponent {
  @Input({ required: true }) colors!: ColorInfo[];
  @Output() copy = new EventEmitter<string>();

  handleCopy(color: ColorInfo): void {
    this.copy.emit(color.hex);
  }
}