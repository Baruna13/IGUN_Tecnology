---
name: Smart School Finder
colors:
  surface: '#0c1321'
  surface-dim: '#0c1321'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1c'
  surface-container-low: '#151b2a'
  surface-container: '#19202e'
  surface-container-high: '#232a39'
  surface-container-highest: '#2e3544'
  on-surface: '#dce2f6'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dce2f6'
  inverse-on-surface: '#2a3040'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#eec200'
  on-tertiary: '#3c2f00'
  tertiary-container: '#cea700'
  on-tertiary-container: '#4e3e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffe083'
  tertiary-fixed-dim: '#eec200'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#0c1321'
  on-background: '#dce2f6'
  surface-variant: '#2e3544'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  hud-inset-desktop: 1.5rem
  hud-inset-mobile: 1rem
  drawer-width-desktop: 420px
  drawer-width-collapsed: 72px
---

## Brand & Style

This design system establishes a high-precision, geospatial intelligence interface tailored for modern school navigation, catchment zone analysis, and educational demographics discovery. The target audience encompasses data-driven parents, urban planners, real-estate analysts, and district administrators who need actionable spatial insights without cognitive fatigue.

The visual style synthesizes dark-mode Web GIS aesthetics—drawing from Apple Maps dark mode clarity, Google Maps night navigation, Uber's dispatch telemetry, and tier-one SaaS analytics suites. The aesthetic centers on:
- **Atmospheric Dark Canvas**: Deep oceanic navy backdrop that recedes, allowing rich vector map features and data layers to shine forward.
- **Precision Glassmorphism**: Translucent floating glass cards (70% opacity) treated with dynamic backdrop blurs, luminous micro-borders, and high-frequency edge speculars that reflect map luminescence.
- **Active Radiant Telemetry**: High-chroma electric blue accents paired with targeted luminous halos for active states, catchment polygons, and points of interest.
- **Crisp Data Density**: Utilitarian, clean typography with high-contrast legibility across rapid zoom levels and dense HUD overlays.

## Colors

The palette is engineered specifically for dark-mode cartography and high-density telemetry overlays. The foundational surface uses deep navy `#0B1220` rather than pure charcoal, sustaining visual depth and supporting multi-layered geospatial vector tiles.

### Palette Architecture
- **Canvas Base**: `#0B1220` (Deep Void Navy). Provides the foundational baseline for maps, canvas viewports, and deep chrome.
- **Glass Surfaces**: `#131E36` with alpha channel shifts (`rgba(19, 30, 54, 0.70)` to `rgba(19, 30, 54, 0.88)`) for floating toolbars, drawers, and modal sheets.
- **Borders & Specular Highlights**: White/Cyan translucency (`rgba(255, 255, 255, 0.08)` to `rgba(59, 130, 246, 0.35)`) defining 1px glass card perimeters.
- **Primary Electric Blue (`#3B82F6`)**: Core brand, active boundary highlights, primary CTA triggers, and selected school nodes.
- **Success Emerald (`#22C55E`)**: High ratings, public school indicators, capacity availability, and open enrollment statuses.
- **Warning Amber (`#FACC15`)**: Waitlists, mid-tier scoring, bus route transfers, and caution metrics.
- **Danger Crimson (`#EF4444`)**: Capacity bottlenecks, zone boundary exclusions, and private school premium alerts.
- **Neutral Foreground Text**: Crisp high-contrast tones starting from `#F8FAFC` (Headline/Display) descending to `#94A3B8` (Metadata/Labels) and `#475569` (Disabled/Inactive vectors).

## Typography

The typographic hierarchy pairs **Plus Jakarta Sans** for display, titles, and card headers with **Inter** for dense metadata, tables, telemetry reads, and map controls.

- **Plus Jakarta Sans**: Employs geometric warmth with modern structural curves, giving search bars, school cards, and performance headers a clean, Apple-tier polished aesthetic.
- **Inter**: Neutral, highly legible at micro scale (10px–12px), optimized for fast data intake in HUD chips, demographic percentages, coordinates, and layer toggles.
- **Contrast Ratios**: Body text conforms strictly to WCAG AAA against the `0.70` glass backing by keeping standard copy at `#E2E8F0` and micro copy at `#94A3B8`.
- **Tabular Figures**: All numerical metrics (scores, travel distance, student-teacher ratios) must implement `font-variant-numeric: tabular-nums` to eliminate layout shift during live filter slider interactions.

## Layout & Spacing

The layout is a **Viewport-Anchored Fluid Canvas** with floating contextual HUDs. Rather than a standard page grid with scrollbars, the GIS map consumes 100% of the viewport (`100vw`, `100dvh`), and UI modules float over the coordinates layer.

### Spacing Structure
- **Base Increment**: Standard 8pt base grid with a 4pt micro-scale for compact map controls and badges.
- **Desktop (1024px+)**:
  - Full-height floating sidebar drawer (`420px` width) docked `1.5rem` from the left edge.
  - Floating horizontal filter and search omnibar centered along the top margin.
  - Dedicated stack of micro HUD controls (zoom, 3D tilt, pitch, geolocate, layers) pinned `1.5rem` from the bottom-right and top-right corners.
- **Tablet (768px - 1023px)**:
  - Sidebar transitions to a collapsible slide-over panel (`360px` width).
  - Floating map controls condense into a consolidated floating action capsule.
- **Mobile (< 768px)**:
  - Bottom glass sheet utilizing dynamic drag anchors (peek: `120px`, half: `45vh`, full: `90vh`).
  - Search and filter pills cluster into a single top floating capsule with safe-area insets (`env(safe-area-inset-top)`).

## Elevation & Depth

Visual hierarchy uses a refined hybrid of **Glassmorphism**, **Multi-Stop Ambient Shadows**, and **Luminescent Neon Occlusion**.

### Elevation Layers
1. **Level 0 (Map Canvas)**: Base vector/satellite terrain with night-mode vector tiles tinted `#0B1220`.
2. **Level 1 (Map Overlays & Heatmaps)**: Polygon zones, catchment boundaries, and demographic isolines drawn with 20%–40% fill opacity and luminous stroke edges.
3. **Level 2 (Passive Floating Glass)**: Search inputs, map controls, and standard school cards.
   - Background: `rgba(19, 30, 54, 0.70)`.
   - Blur: `backdrop-filter: blur(16px) saturate(180%)`.
   - Border: `1px solid rgba(255, 255, 255, 0.08)`.
   - Shadow: `0 8px 32px 0 rgba(3, 7, 18, 0.45)`.
4. **Level 3 (Interactive / Hover Glass)**:
   - Border: `1px solid rgba(59, 130, 246, 0.40)`.
   - Shadow: `0 12px 40px -4px rgba(3, 7, 18, 0.65), 0 0 16px -2px rgba(59, 130, 246, 0.30)`.
5. **Level 4 (Active Modals & Critical Flyouts)**: Full detail school sheets and comparison matrices.
   - Background: `rgba(15, 23, 42, 0.85)`.
   - Blur: `backdrop-filter: blur(24px) saturate(200%)`.
   - Border: `1px solid rgba(255, 255, 255, 0.15)`.
   - Shadow: `0 24px 64px 0 rgba(0, 0, 0, 0.75), 0 0 24px 0 rgba(59, 130, 246, 0.25)`.

## Shapes

The design system uses generous, organic corner radii to echo modern iOS floating sheets and Apple Maps card interfaces.

- **Standard Cards & Floating Drawers**: `16px` (`rounded-lg`) to `24px` (`rounded-xl`) corner radiuses create a soft, non-intrusive container feel over continuous map terrain.
- **Search Omnibar & Action Pills**: Fully continuous pill shapes (`9999px`) for high-frequency actions, filter tags, and quick-filter presets.
- **Micro Map Buttons (Zoom/Pitch/Layers)**: `12px` to `16px` rounded squares maintaining visual alignment with larger parent panels.
- **Interactive Map Node Pins**: Teardrop vectors transitioning into glowing circular badges upon expansion.

## Components

### 1. Primary, Secondary & Map Control Buttons
- **Primary Action**: Electric Blue `#3B82F6` solid fill with white text (`#FFFFFF`), subtle inner white highlight (`inset 0 1px 0 rgba(255,255,255,0.2)`), and radiant blue drop shadow (`0 4px 14px rgba(59, 130, 246, 0.4)`).
- **Secondary Action**: Glass pill button (`rgba(255, 255, 255, 0.05)` fill, `1px solid rgba(255, 255, 255, 0.12)` border, `#F1F5F9` text).
- **Map Floating Controls**: `44x44px` glass squircle containers (`rgba(19, 30, 54, 0.75)` backdrop blur `16px`), containing centered SVG icons in `#E2E8F0`. Active state illuminates icon with `#3B82F6` and adds a subtle glow.

### 2. Search Omnibar & Filter Chips
- **Omnibar**: High-prominence floating pill (`h-14`), 70% glass opacity, with embedded geocoder icon, clear-search shortcut, and dynamic predictive result dropdown with divider-free frosted list items.
- **Filter Chips**: Pill-shaped badges with `8px` padding. Inactive state: `rgba(255, 255, 255, 0.06)` with `#94A3B8` label. Selected state: `rgba(59, 130, 246, 0.15)` fill with `1px solid #3B82F6`, `#60A5FA` text, and a `4px` glowing status dot.

### 3. School Result Cards (HUD & Sidebar)
- Built with `rounded-xl` (16px–20px) corners, 70% deep-navy frosted glass, and padding of `16px`.
- Contains:
  - Top row: School name in `headline-sm` with public/private status chip.
  - Rating badge: Rounded rectangle with Emerald Green `#22C55E` or Amber `#FACC15` text, matching subtle colored tint background (`rgba(34, 197, 94, 0.15)`).
  - Telemetry row: Student count, student-teacher ratio, and walk/drive time metrics with tabular figures and micro icons.
  - Quick action CTA bar: "Compare", "Directions", "Catchment Polygon".

### 4. Form Inputs & Filter Sliders
- **Range Sliders (Distance, Ratings)**: `#1E293B` track background with `#3B82F6` active fill and a luminous circular thumb (`#FFFFFF` with `#3B82F6` glowing border).
- **Checkboxes & Radios**: Custom rounded squares and circles with `rgba(255, 255, 255, 0.1)` inactive border, animating to `#3B82F6` fill with sharp white check marks.

### 5. Geospatial Callouts & Tooltips
- Anchored directly over school coordinates with an inverted triangle anchor.
- Micro-frosted panel (`backdrop-filter: blur(12px)`, `rgba(15, 23, 42, 0.85)`), displaying school name, rank pill, and instantaneous travel delta. Hovering card triggers synchronous polygon highlights on the map viewport.