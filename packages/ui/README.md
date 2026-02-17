# UI Package

A shared UI component library built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## Setup in Apps

### Automatic Setup (Recommended)

Create a vite app in the apps folder and use the name of the app in the bun setup-ui-app <app-name>

The easiest way to set up the UI package in a new Vite app is using the setup script from the root of the application:

```bash
bun setup-ui-app <app-name>
```

**Example:**

```bash
bun setup-ui-app marketing
```

This command will automatically:

- Copy `components.json` (shadcn/ui configuration)
- Copy `postcss.config.mjs` (PostCSS configuration for Tailwind)
- Add `@tailwindcss/postcss` to devDependencies
- Add `import "@repo/ui/globals.css";` to your `main.tsx`

Then install dependencies:

```bash
bun install
```

### Manual Setup

If you prefer to set up manually, follow these steps:

#### 1. Add UI Package Dependency

In your app's `package.json`:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18"
  }
}
```

#### 2. Copy Configuration Files

Copy these files from `packages/ui/` to your app root:

- `components.json` - shadcn/ui configuration
- `postcss.config.mjs` - PostCSS configuration

#### 3. Import Globals CSS

In your `src/main.tsx`:

```tsx
import "@repo/ui/globals.css";
import App from "./App.tsx";
```

#### 4. Install Dependencies

```bash
bun install
```

## Using Components

Once set up, you can import components from `@repo/ui`:

```tsx
import { Button } from "@repo/ui/components/ui/button";

export default function App() {
  return <Button>Click me</Button>;
}
```

## Adding New Components

To add new components to the UI library using shadcn/ui:

```bash
cd packages/ui
bunx shadcn@latest add <component-name>
```

**Example:**

```bash
bunx shadcn@latest add dialog
```

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/           # Custom React hooks
│   ├── lib/
│   │   └── utils.ts     # Utility functions
│   └── styles/
│       └── globals.css  # Global styles with Tailwind
├── components.json      # shadcn/ui config
├── postcss.config.mjs   # PostCSS config for Tailwind
└── tsconfig.json        # TypeScript config
```

## Tailwind CSS

This package uses Tailwind CSS v4 with the new `@tailwindcss/postcss` plugin. Styles are configured in:

- `src/styles/globals.css` - Global Tailwind setup and custom CSS variables

## Theme Customization

CSS variables for theming are defined in `src/styles/globals.css` under the `:root` selector. Override them in your app's CSS to customize colors and design tokens.
