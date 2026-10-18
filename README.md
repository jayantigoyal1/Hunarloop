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
		badges.ts
		careers.ts
		circles.ts
		demo.ts
		games.ts
		opportunities.ts
		roadmap.ts
		student.ts
		teacherStudents.ts
	lib/
		i18n.ts
		store.ts
		utils.ts
```

The header language switch toggles English/Hindi. Its settings menu holds calm mode, the reading font, spoken questions, and the offline demo toggle. These preferences are saved on this device. The student tab bar links to Home, Passport, Careers, Opportunities, and Rewards. `font-dyslexic` uses OpenDyslexic when available on the device and falls back to a readable local font.

Phases 0–5 include welcome, onboarding, the editable Hunar Passport, three playable talent games, game results, learning comfort controls and preview, the persisted demo store, and data fixtures. The other routes are placeholders for upcoming phases. The offline toggle simulates offline status; it does not cache the site for a fresh offline visit.

The passport saves profile edits, learning choices, sharing preferences, and evidence filenames to localStorage. The mock file picker never reads or uploads file contents. The employer preview uses an explicit allowlist of name, interests, skills, and goals. Teacher sharing is a saved demo preference; no information is sent. Editing a demo teacher-verified skill removes its verification. Run `npm run test:passport` to check persistence, verification, storage failures, and the employer preview boundary.

Each talent game runs for two minutes of active play. Switching tabs pauses the game; the student resumes when ready. Skip saves partial metrics without adding a completed session or points. Word Pop uses spoken words and picture bubbles, with a picture-matching fallback. Sequence Memory records completed spans and raw sequences. Catch the Star records taps and four 30-second windows; calm mode or reduced-motion preferences use stationary targets.

Raw metrics stay in localStorage. Word reaction times start when the spoken prompt ends (or the visual prompt becomes available). Star accuracy is star taps divided by all taps; extra taps count decoys and empty space. The stored `dropOff` is the first window's catch rate minus the last window's catch rate, and is null when either window has no stars. These metrics are never shown as student labels or included in the employer preview.

The `/games/results` page links to confidence-labelled skill suggestions in Passport. `/comfort` offers optional preferences to everyone; support patterns appear after three completed sessions with metrics. Expand **Demo controls** at the bottom of `/games` to find **Simulate 3 sessions**. It requires consent, fills missing sessions up to three, marks them as simulated, and can be used repeatedly without adding duplicates. Rhythm Tap, Noise Choice, and Instruction Recall are roadmap cards.

Verification commands:

Phase 5 adds six optional comfort settings, confidence-labelled support clusters, a live lesson preview, read-aloud controls, and a persistent ten-minute focus timer. Choices are available without playing games. Three real sessions of the same game can raise its demo confidence label to Medium; simulations remain Low and sensory comfort is never inferred. This rule is not validated. Settings never change rewards or employer-visible data. Future plan, teacher and parent integrations are explicitly labelled as future features.

Run `node --test tests/comfort.test.cjs` for confidence, persistence, timer and reward checks. Browser checks also cover adapted lessons, global preferences, Hindi audio fallback and the timer at 360px.

```bash
npm run test:passport
npm run test:games
npm run build
npm run test:browser
```

Browser tests use an installed Microsoft Edge, a 360px viewport, mocked speech, and a controlled clock. They launch the production server on port 3100 and stop it afterward. Real device voices depend on the browser; the picture fallback remains available.
