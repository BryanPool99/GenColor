import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Locale = 'es' | 'en';

export interface TranslationData {
  app: { title: string; subtitle: string };
  palette: Record<string, string>;
  colors: Record<string, string>;
  paletteTypes: Record<string, { name: string; desc: string }>;
  actions: Record<string, string>;
  aria: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'app-locale';

  readonly locale = signal<Locale>('es');
  readonly translations = signal<TranslationData | null>(null);
  readonly isLoading = signal(false);

  readonly currentTranslations = computed(() => this.translations());

  constructor() {
    this.initializeLocale();
    effect(() => {
      this.loadTranslations(this.locale());
    });
  }

  private initializeLocale(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'es' || stored === 'en')) {
      this.locale.set(stored);
    }
  }

  async setLocale(locale: Locale): Promise<void> {
    if (locale !== this.locale()) {
      this.locale.set(locale);
      localStorage.setItem(this.STORAGE_KEY, locale);
    }
  }

  private async loadTranslations(locale: Locale): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<TranslationData>(`/assets/i18n/${locale}.json`)
      );
      this.translations.set(data);
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
      this.translations.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  t(key: string): string {
    const translations = this.translations();
    if (!translations) return key;

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  tPalette(key: string): string {
    return this.t(`palette.${key}`);
  }

  tColor(key: string): string {
    return this.t(`colors.${key}`);
  }

  tPaletteType(id: string, field: 'name' | 'desc'): string {
    return this.t(`paletteTypes.${id}.${field}`);
  }

  tAction(key: string): string {
    return this.t(`actions.${key}`);
  }

  tAria(key: string): string {
    return this.t(`aria.${key}`);
  }
}