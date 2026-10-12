# Color Palette Generator

Generador de paletas de colores profesional construido con **Angular 19**, **Signals**, **Tailwind CSS** y validación **WCAG**.

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Jasmine/Karma-8A4182?style=flat-square&logo=jasmine&logoColor=white)

## Características

### Tipos de paleta (8 algoritmos)
- **Monocromática** — Variaciones de luminosidad de un solo tono
- **Complementario** — Color opuesto en la rueda (180°)
- **Análoga** — Colores adyacentes (±30°) para armonía natural
- **Tríádica** — Tres colores equidistantes (120°)
- **Tetrádica** — Cuatro colores en rectángulo (60°, 180°, 240°)
- **Cuadrada** — Cuatro colores en cuadrado (45°, 90°, 135°, 180°)
- **Armonía** — Análogos + complementario
- **Tendencia 2026** — Paleta curada basada en el color base actual

### Funcionalidades
- **Color picker** nativo + input HEX manual
- **Validación WCAG AA/AAA** en tiempo real (contraste con blanco/negro)
- **Modo oscuro/claro** con persistencia en localStorage y detección de preferencia del sistema
- **Favoritos** guardados localmente
- **Exportar a JSON** (paleta + metadatos)
- **Copy-to-clipboard** con feedback visual
- **Preview de UI** simulando header, surface, botón, textos

### Accesibilidad
- Contraste mínimo 4.5:1 (AA) / 7:1 (AAA)
- Navegación por teclado completa
- ARIA labels en controles interactivos
- Focus visible en todos los elementos
- Semántica HTML correcta

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | Angular 19 (standalone components, signals) |
| Reactividad | `signal`, `computed`, `effect`, `linkedSignal` |
| Estilos | Tailwind CSS 3.4 + CSS Custom Properties |
| Testing | Jasmine + Karma (unit tests >90% coverage) |
| Build | Angular CLI + Vite (esbuild) |
| Calidad | TypeScript strict, ESLint, Prettier |

## Instalación y uso

```bash
# Clonar e instalar
git clone <repo-url>
cd color-palette-generator
npm install

# Desarrollo
npm start          # http://localhost:4200

# Testing
npm test           # Watch mode
npm run test:ci    # Single run (CI)

# Build producción
npm run build      # dist/color-palette-generator
```

## Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── color-palette.component.ts   # Grid de swatches
│   │   ├── color-swatch.component.ts    # Swatch individual con copy
│   │   └── palette-selector.component.ts # Selector de 8 tipos
│   ├── services/
│   │   ├── color.service.ts             # Lógica de color + paletas (250+ tests)
│   │   └── theme.service.ts             # Dark/light mode + persistencia
│   ├── app.component.ts                 # Componente principal
│   ├── app.component.html               # Template
│   └── app.config.ts                    # Configuración Angular
├── styles.css                           # Estilos globales + variables CSS
└── tailwind.config.js                   # Config Tailwind + darkMode: class
```

## API del servicio de color

```typescript
// ColorService (inyectable, providedIn: 'root')

// Color base reactivo
currentColor: Signal<ColorInfo>

// Paletas computadas (reactivas al color base)
complementary(): Signal<ColorInfo[]>
monochromatic(): Signal<ColorInfo[]>
analogous(): Signal<ColorInfo[]>
triadic(): Signal<ColorInfo[]>
tetradic(): Signal<ColorInfo[]>
square(): Signal<ColorInfo[]>
harmony(): Signal<ColorInfo[]>
trending2026(): Signal<ColorInfo[]>

// Utilidades
setBaseColor(hex: string): void
setRandomColor(): void
setRandomColorWithVariety(): void
getContrastRatio(hex1, hex2): number
meetsWcagAA(bg, fg): boolean
meetsWcagAAA(bg, fg): boolean
getColorName(hex): string
```

## Roadmap / Próximas versiones

### v1.1 - Arquitectura y UX
- [ ] **Extracción de componentes**: Mover paleta, selector, preview a componentes standalone reutilizables
- [ ] **Estado en URL**: `?palette=triadic&color=#ff6b35` para compartir/enlazar paletas
- [ ] **PWA**: Service worker, manifest, instalable offline-first

### v1.2 - Export y Integraciones
- [ ] **Export Tailwind Config** (`tailwind.config.js` generado)
- [ ] **Export CSS Custom Properties** (`:root { --color-primary: ... }`)
- [ ] **Export Figma JSON** (plugin-compatible)
- [ ] **Export Adobe ASE** (Swatch Exchange)

### v1.3 - Accesibilidad avanzada
- [ ] **Simulador de daltonismo**: Protanopia, Deuteranopia, Tritanopia toggle en preview
- [ ] **Modo alto contraste** forzado

### v1.4 - Features creativas
- [ ] **Extracción desde imagen**: Upload → paleta dominante (color-thief)
- [ ] **Generador de gradientes** CSS-ready
- [ ] **Historial de paletas** recientes

### v2.0 - Plataforma
- [ ] **E2E Tests** con Playwright
- [ ] **Storybook** para componentes
- [ ] **i18n** (ES/EN/PT)
- [ ] **Modo presentación** (fullscreen, atajos de teclado)

## Scripts disponibles

```bash
npm start          # Dev server
npm run build      # Build producción
npm run build:dev  # Build desarrollo
npm test           # Tests watch
npm run test:ci    # Tests single-run (CI)
npm run lint       # ESLint + Prettier check
npm run format     # Prettier write
```

## Licencia

MIT — Libre para uso personal y comercial.

---

**¿Te gusta el proyecto?** ⭐ Dale una estrella y compártelo.

*Hecho con Angular Signals + Tailwind CSS*