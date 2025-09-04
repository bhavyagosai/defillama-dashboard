This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- Wallet connection (RainbowKit + wagmi).
  - Custom themed connect button.
  - Custom themed account + chain buttons.
  - responsive with icon view and text view.
- Yield Aggregator category locked until wallet connects; tooltip, icon, disabled tab.
  - This means even trying to land on /pool/{poolID} page directly for a locked category would not work.
- Dynamic filtering of Yield Aggregator pools in “All” until unlocked.
- Dashboard views:
  - Card view: project, chain, category, APY, 30d avg APY, risk (σ), TVL.
  - Table view: horizontally scrollable, sticky first column for desktop view, prediction visuals.
- Prediction visuals: color-coded icons and probability in cards, table, and detail.
- Project avatars: deterministic color + initials beside project.
- Pool detail with historical APY chart. Locked detail for Yield Aggregator until wallet connects.
  - chart used is area chart.
  - data tailored acc to usecase: only last year + only one point (first) from every month.
- Sidebar: persistent on desktop, collapsible on mobile with overlay + hamburger with dummy links.
  - wallet connection label with pulsating animation.
- Theme toggle: light/dark via document class; splash respects CSS tokens.
- Data caching: DataContext with periodic refresh; resilient error/empty states.
  - initial pools data is stored in a context avaialble to use everywhere without prop drilling
  - manual option to fetch pool data
  - periodic fetching of pool data happens every 5 minutes to update cached data
    - checks every 1 minute
  - wrapper to cache per pool historical data added but no caching added as of now to prevent complications/would have been time consuming.
- gracefully handle errors
- proper responsive design and implementation
- splash screen
- have set fallbacks to env for now apart from WalletConnect Project ID.

## Configuration (.env.local)

Create a `.env.local` and set:

```bash
NEXT_PUBLIC_YIELDS_API_BASE=https://yields.llama.fi
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
# Optional JSON (single line) to override pool categories
NEXT_PUBLIC_POOL_CONFIG=
```

Notes:

- If `NEXT_PUBLIC_POOL_CONFIG` is invalid/missing, defaults are used.
- Restart dev server after changing envs.
