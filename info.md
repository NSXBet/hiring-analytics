# Lovable Base Template

Full-featured React + TypeScript template with 40+ shadcn/ui components, React Query, React Router, and a complete design system. Ideal for custom apps, dashboards, SaaS, and tools.

**Stack**: React 18, Vite, TypeScript, Tailwind CSS 3, shadcn/ui

## Pre-installed Components (40+)

  accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb,
  button, calendar, card, carousel, chart, checkbox, collapsible, command,
  context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp,
  input, label, menubar, navigation-menu, pagination, popover, progress,
  radio-group, resizable, scroll-area, select, separator, sheet, sidebar,
  skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster,
  toggle-group, toggle, tooltip

## Pre-installed Libraries

  @tanstack/react-query (v5) — Data fetching and caching
  react-router-dom (v6) — Client-side routing
  react-hook-form + zod — Form handling and validation
  recharts — Charts and data visualization
  lucide-react — Icons (400+)
  date-fns — Date utilities
  sonner — Toast notifications
  tailwindcss-animate — Animation utilities
  vaul — Drawer component
  embla-carousel-react — Carousels
  cmdk — Command palette
  input-otp — OTP input

## Usage

  import { Button } from '@/components/ui/button'
  import { Card, CardHeader, CardTitle } from '@/components/ui/card'
  import { useQuery } from '@tanstack/react-query'
  import { useNavigate } from 'react-router-dom'

## Structure

  src/components/ui/   shadcn/ui components (DO NOT modify)
  src/components/      Custom components (create here)
  src/pages/           Page components (Index.tsx, NotFound.tsx)
  src/hooks/           Custom hooks (use-mobile.tsx, use-toast.ts)
  src/lib/             Utilities (utils.ts with cn())
  src/types/           TypeScript type definitions
  src/services/        API service layer
  src/App.tsx          Root component (providers + routing)
  src/index.css        Design system tokens (CSS custom properties)
  src/main.tsx         Entry point
  tailwind.config.ts   Tailwind theme (maps CSS vars to utilities)
  vite.config.ts       Vite configuration

## Key Customization Points

  1. src/index.css — Define your design tokens (colors, gradients, shadows)
     All colors use HSL format: --primary: 222.2 47.4% 11.2%;
     Both :root (light) and .dark (dark mode) tokens are included

  2. tailwind.config.ts — Extend theme with custom animations and values
     Already maps all design tokens from index.css

  3. src/pages/Index.tsx — Your home page (replace the placeholder)

  4. src/App.tsx — Add new routes here
     Already configured with QueryClientProvider, TooltipProvider,
     Toaster (shadcn), Sonner, and BrowserRouter

## Design System Rules

  - NEVER use direct color classes (text-white, bg-black, etc.)
  - ALWAYS use semantic tokens (text-foreground, bg-background, bg-primary, etc.)
  - Customize by editing index.css tokens, not by overriding in components
  - Create component variants instead of className overrides
