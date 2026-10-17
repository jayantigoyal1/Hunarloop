# HunarLoop

A frontend-only career journey prototype for rural students. The UI uses demo data, stores preferences in localStorage, and requires no API keys or backend.

## Setup

From the parent directory, create the requested TypeScript, Tailwind, App Router project with a `src` directory:

```bash
npx create-next-app@latest hunarloop --typescript --tailwind --eslint --app --src-dir --use-npm
cd hunarloop
npm install next@14 react@18 react-dom@18 zustand framer-motion lucide-react
npm install --save-dev tailwindcss@3.4.17 eslint@8.57.1 eslint-config-next@14.2.35
```

The project is pinned to Next.js 14 / React 18 and Tailwind 3 for a compatible production build.

## Run

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

```text
src/
	app/
		page.tsx
		onboarding/page.tsx
		passport/page.tsx
		games/page.tsx
		comfort/page.tsx
		careers/page.tsx
		roadmap/page.tsx
		opportunities/page.tsx
		rewards/page.tsx
		circles/page.tsx
		parent/page.tsx
		teacher/page.tsx
	components/
		app-shell.tsx
		route-page.tsx
		ui.tsx
	data/
		demo.ts
	lib/
		i18n.ts
		store.ts
		utils.ts
```

The header language switch toggles English/Hindi and persists with calm-mode preferences. The student tab bar links to Home, Passport, Careers, Opportunities, and Rewards. `font-dyslexic` is an optional CSS font fallback class; users may supply an OpenDyslexic font locally if desired.
