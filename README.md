# MVA Frontend

A modern, Figma-accurate authentication UI built with React, Vite, Tailwind CSS, and shadcn/ui components.

## Features

- **Pixel-perfect Login & Signup**: Responsive, Figma-matching layouts with custom gradients, typography, and theme.
- **Custom Theme**: All colors, fonts, and gradients are defined in `tailwind.config.js` for easy design system management.
- **Reusable Components**: Includes a prop-based `CustomButton`, shadcn/ui `Alert` and `Progress` components, and more.
- **Beautiful Gradients**: Auth pages use layered radial and linear gradients for a premium look.
- **Loading Experience**: Animated progress bar (shadcn/ui) on the loading page, auto-redirects to login.
- **Accessibility**: Proper focus states, color contrast, and keyboard navigation.
- **shadcn/ui Ready**: All components and utilities are compatible with shadcn/ui conventions and import aliases.

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (recommended) or npm/yarn

### Install

```sh
pnpm install
# or
npm install
```

### Run the App

```sh
pnpm dev
# or
npm run dev
```

### Build for Production

```sh
pnpm build
# or
npm run build
```

## Project Structure

- `src/pages/` — Main pages (Login, Signup, Loading)
- `src/components/` — Reusable UI components (CustomButton, shadcn/ui Alert, Progress)
- `src/lib/utils.js` — Utility functions (e.g., `cn` for className merging)
- `tailwind.config.js` — Custom theme, colors, gradients, and typography
- `vite.config.js` — Vite config with alias support for `@/`

## Design System

- **Font**: Inter (Google Fonts)
- **Primary Color**: #4648AB and palette in `tailwind.config.js`
- **Gradients**: Custom backgrounds for all auth pages
- **Button**: Gradient, hover, disabled, and icon support
- **Inputs**: Borderless, subtle hover/focus, custom placeholder color
- **Alerts**: shadcn/ui style, color-coded for error/warning

## Customization

- Edit `tailwind.config.js` to change theme colors, fonts, or gradients.
- Add more shadcn/ui components as needed.

## Credits

- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Figma](https://www.figma.com/)

---

_Made with ❤️ by your team._
