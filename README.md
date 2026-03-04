# Next.js Boilerplate

Production-ready boilerplate for SSR frontend / portal projects.

## Tech Stack

| Component      | Version | Role                                    |
| -------------- | ------- | --------------------------------------- |
| Bun            | 1.x     | Package manager & runtime               |
| Next.js        | 16.x    | SSR framework (App Router, Turbopack)   |
| React          | 19.x    | UI library                              |
| TypeScript     | 5.x     | Type safety (strict mode)               |
| TailwindCSS    | v4.x    | Utility-first CSS (CSS-first config)    |
| DaisyUI        | v5.x    | Component library (`@plugin` syntax)    |
| Biome          | v2.x    | Linter + Formatter                      |

## Prerequisites

- [Bun](https://bun.sh) >= 1.1

## Getting Started

```bash
# Install dependencies
bun install

# Start development server (http://localhost:3000)
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Linting & Formatting

```bash
# Check for lint errors
bun run lint

# Fix lint errors automatically
bun run lint:fix

# Format all files
bun run format
```

## Project Structure

```
app/
├── about/
│   └── page.tsx               # About page
├── contact/
│   └── page.tsx               # Contact page
├── dashboard/
│   └── page.tsx               # Dashboard page
├── globals.css                # TailwindCSS v4 + DaisyUI v5 config
├── layout.tsx                 # Root layout
└── page.tsx                   # Homepage (composes components)
components/
├── dark-mode-alert.tsx        # Dark mode info alert
├── getting-started-card.tsx   # Getting started card with doc links
├── hero.tsx                   # Hero section
├── tech-badges.tsx            # Tech stack badge row
└── tech-stack-table.tsx       # Tech stack overview table
public/                        # Static assets
biome.json                     # Biome linter + formatter config
next.config.ts                 # Next.js config
postcss.config.mjs             # PostCSS config
tsconfig.json                  # TypeScript config
```

## Theming

This boilerplate uses DaisyUI v5 with automatic dark mode. Themes are configured in `app/globals.css`:

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

- `light` theme is applied by default
- `dark` theme activates automatically via `prefers-color-scheme: dark`
- Add more themes from the [DaisyUI theme list](https://daisyui.com/docs/themes/)

## Deployment

### Vercel

Deploy with zero configuration:

```bash
bunx vercel
```

### Docker

```bash
# Build the image
docker build -t bun-next-tw-boilerplate .

# Run the container
docker run -p 3000:3000 bun-next-tw-boilerplate
```

### Static Export

To export as static HTML, change `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
};
```

Then run `bun run build` — output will be in the `out/` directory.
