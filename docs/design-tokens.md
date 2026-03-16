# Artemis Design Tokens

Reference document extracted from Figma design and HTML prototypes.
See `app/globals.css` for the CSS custom properties implementation.

---

## Color Palette

### Brand
| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-brand` | `linear-gradient(135deg, #9810fa, #155dfc)` | Logo icon, brand accents |
| `--gradient-tip` | `linear-gradient(158deg, #faf5ff, #eff6ff)` | Pro tip card background |

### Semantic Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-primary` | `#8200db` | `#a855f7` | Primary actions, active nav, links |
| `--color-primary-light` | `#f3e8ff` | `#2e1065` | Light purple backgrounds |
| `--color-primary-bg` | `#faf5ff` | `#1e1033` | Active nav background |
| `--color-blue` | `#1447e6` | `#60a5fa` | Active env button text |
| `--color-blue-light` | `#dbeafe` | `#1e3a5f` | Active env button background |
| `--color-blue-border` | `#8ec5ff` | `#3b82f6` | Active env button border |
| `--color-green` | `#16a34a` | `#4ade80` | Active indicators, success |
| `--color-green-light` | `#dcfce7` | `#14532d` | Active version badge bg |
| `--color-red` | `#ef4444` | `#f87171` | Danger / delete actions |
| `--color-orange` | `#ff6900` | `#fb923c` | Environment indicator |
| `--color-yellow-bg` | `#fffbeb` | `#422006` | Dispatcher node background |
| `--color-yellow-border` | `#fcd34d` | `#a16207` | Dispatcher node border |

### Text Hierarchy
| Token | Light | Usage |
|-------|-------|-------|
| `--color-text-heading` | `#101828` | Headings, primary text |
| `--color-text-primary` | `#364153` | Nav links, card titles |
| `--color-text-secondary` | `#4a5565` | Body text, descriptions |
| `--color-text-tertiary` | `#6a7282` | Subtitles, metadata |
| `--color-text-muted` | `#9ca3af` | Icons, placeholders |
| `--color-text-placeholder` | `#717182` | Input placeholders |

### Surfaces
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-bg-page` | `#f9fafb` | `#111827` | Main content area |
| `--color-bg-card` | `#ffffff` | `#1f2937` | Cards, sidebar, modals |
| `--color-bg-input` | `#f3f3f5` | `#374151` | Search input background |
| `--color-bg-badge` | `#eceef2` | `#374151` | Badge / tag backgrounds |
| `--color-bg-tag` | `#f3f4f6` | `#374151` | Tag backgrounds |
| `--color-bg-inactive` | `#f3f4f6` | `#374151` | Inactive env button bg |

### Borders
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-border` | `#e5e7eb` | `#374151` | Sidebar, card footer, dividers |
| `--color-border-card` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Card outer border |
| `--color-border-line` | `#d1d5db` | `#4b5563` | Graph connector lines |

### Special Colors
| Value | Usage |
|-------|-------|
| `#030213` | Save button (near-black) |
| `#166534` | Dark green text (alternate) |
| `#ffedd4` | Orange stat card background |

---

## Typography

### Font Family
- **Primary:** Inter (Google Fonts)
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Page title (h1) | 30px | 700 | 36px | 0.4px |
| Sidebar brand | 24px | 600 | 36px | 0.07px |
| Card title | 18px | 600 | 28px | -0.44px |
| Nav link | 16px | 500 | 24px | -0.31px |
| Body text | 16px | 400 | 24px | -0.31px |
| Subtitle | 16px | 600 | 24px | -- |
| Label / button | 14px | 500 | 20px | -0.15px |
| Stat label | 14px | 400 | 20px | -0.15px |
| Stat value | 30px | 700 | 36px | 0.4px |
| Graph node name | 14px | 600 | 20px | -- |
| Description | 13px | 400 | 20px | -- |
| Badge / tag | 12px | 500 | 16px | -- |
| Metadata | 11px | 400 | 16px | -- |
| Graph pill label | 13px | 600 | -- | -- |

---

## Spacing

### Layout
| Area | Value |
|------|-------|
| Sidebar width | 256px |
| Top bar height | 71px |
| Sidebar header height | 101px |
| Content padding | 32px vertical, 64px horizontal |
| Max content width | 1100px (detail), 1280px (dashboard) |

### Component Spacing
| Element | Padding |
|---------|---------|
| Sidebar header | 24px |
| Nav section | 16px |
| Nav link | 12px 16px |
| Card | 24px |
| Stat card | 24px |
| Graph nodes | 20px 16px |
| Button | 8px 16px |
| Badge | 2px 8px |

### Gap Scale
| Value | Usage |
|-------|-------|
| 4px | Nav items, badge gap |
| 6px | Tags |
| 8px | Buttons in footer, env buttons, graph connector height |
| 12px | Sidebar header items, card sections, nav icon-text |
| 16px | Section padding |
| 20px | Graph nodes horizontal gap |
| 24px | Card grid gap, major sections |

---

## Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-badge` | 6px | Badges, tags |
| `--radius-button` | 8px | Buttons, inputs |
| `--radius-sidebar-item` | 10px | Nav links, env buttons, logo icon |
| `--radius-node` | 12px | Graph agent nodes |
| `--radius-card` | 14px | Cards, panels |
| `--radius-pill` | 50px | START/END graph nodes |

---

## Component Naming Conventions

### Layout
- `Sidebar` -- Fixed left nav (256px)
- `TopBar` -- Top header bar with env switcher
- `AppShell` -- Wraps sidebar + topbar + content

### Navigation
- `nav-link` -- Sidebar navigation items
- `env-switch` -- DEV/PROD toggle buttons
- `back-link` -- Breadcrumb back navigation

### Cards
- `prompt-card` -- Card on activate page showing prompt summary
- `stat-card` -- Dashboard stat summary card

### Graph
- `graph-timeline` -- Full graph container
- `graph-node` -- Individual node (start/end/agent/dispatcher)
- `layer-connector` -- SVG lines between graph rows

### Form
- `markdown-editor` -- Tabbed edit/preview textarea
- `search-bar` -- Search input with icon

---

## Figma File Structure

| Frame ID | Name | Description |
|----------|------|-------------|
| `1:2` | Home Page - On Dev Env | Dashboard with stats (no graph) |
| `3:2` | Home Page - With Graph | Dashboard with agent graph |
| `4:124` | Home Page - On PROD Env | Same as home with PROD selected |
| `5:2` | Artemis - Home Page With Graph | Refined graph layout |
| `1:124` | /favorites | Active prompts card grid |
| `10:2` | Artemis - Activate Prompts | Active prompts page |
| `1:279` | /detail/1 | Prompt detail with editor |

Source: `https://www.figma.com/proto/2doCh5RD9TmoNnra7hvddT/Artmeis-Eval?node-id=0-1`
