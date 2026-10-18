# HunarLoop

**Discover your Hunar. Build it. Earn from it.**

HunarLoop is a bilingual, voice first career exploration prototype for rural students in India. It helps a student describe their interests, build an editable skills passport, explore varied career paths, follow a practical weekly plan, and find opportunities with visible sources.

This is a frontend only hackathon project. It uses fictional demo data, requires no backend or API keys, and stores the demo journey in the browser.

## Why HunarLoop?

Career guidance often assumes reliable internet, strong reading confidence, personal devices, nearby coaching, and family familiarity with new career paths. HunarLoop is designed around a different reality:

- patchy connectivity and low end Android devices;
- Hindi or English as the preferred language;
- voice, visual, and hands on ways to respond;
- travel, cost, device, and connectivity constraints;
- explainable career suggestions rather than a black box score;
- family and teacher support without exposing private observations to employers.

## Demo journey

1. **Welcome and onboarding** — choose English or Hindi, review consent, then answer by voice, options, or text.
2. **Hunar Passport** — edit interests, skills, goals, constraints, preferences, and evidence.
3. **Talent games** — play short no reading activities for matching, sequence memory, and attention control.
4. **Learning Comfort Profile** — accept, reject, or postpone optional learning support suggestions.
5. **Career discovery** — compare a diverse set of explainable career recommendations.
6. **Weekly roadmap** — choose audio, visual, or hands on tasks across an eight week plan.
7. **Opportunities** — filter nearby demo programmes and review eligibility, documents, sources, and verification dates.
8. **Community and rewards** — join supervised learning circles and celebrate participation milestones.
9. **Family summary** — listen to a simple bilingual summary of the chosen path, cost, funding, and income range.
10. **Teacher dashboard** — review fictional class progress, validate shared skills, and suggest activities privately.

Use **Skip to demo student** for the fastest walkthrough. After entering the demo, open **Home → Profile questions** to view or update the onboarding answers. The floating **Demo guide** also provides a six step tour.

## Key features

### Student experience

- Mobile first interface tested at 320px and 360px widths
- English and Hindi interface with a persistent language switch
- Browser speech recognition and speech synthesis with text and option fallbacks
- Editable Hunar Passport with confidence labels and teacher sharing controls
- Three playable talent games with local raw metrics
- Optional calm mode, reading font, audio first mode, short lessons, and focus timer
- Explainable career cards with income sources and practical constraints
- Eight week roadmap with locally persisted progress and participation points
- Sourced opportunity cards, local saving, document checklists, and a schematic village map
- PWA manifest, install icons, offline shell, saved opportunities, and a manual offline demonstration

### Family and educator views

- Bilingual parent audio summary with cost, scholarship, income, and local support information
- Responsive teacher dashboard for eight fictional students
- Private support cards, shared Passport details, skill validation, and local recommendations
- Demo lesson module creator with free or paid format choices

## Safety, privacy, and trust

- Learning support signals are confidence labelled suggestions. They are not medical conclusions.
- Students can accept, reject, or postpone every suggested accommodation.
- Sensitive observations stay on the device and are excluded from the employer preview.
- Points are based on participation and completed actions, never sensitive observations.
- Points are not a measure of intelligence or employability.
- Teacher sharing is controlled by the student and saved only as a local demo preference.
- Every opportunity includes an official source and a **Last verified** date.
- Income ranges include a visible source label.
- Evidence files are never uploaded; the prototype stores only locally entered metadata.
- No account, application, SMS, referral, or message is sent by this project.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| UI | React 18 and Tailwind CSS 3 |
| State | Zustand with localStorage persistence |
| Motion | Framer Motion |
| Icons | Lucide React |
| Voice | Browser Web Speech APIs |
| Testing | Node test runner and Playwright |
| Deployment | Vercel |

## Run locally

### Prerequisites

- Node.js 18.17 or newer
- npm
- A Chromium based browser for the complete voice and PWA demonstration

### Installation

```bash
git clone https://github.com/jayantigoyal1/Hunarloop.git
cd Hunarloop
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create and type check the production build |
| `npm run start` | Run the production build locally |
| `npm run test:passport` | Test Passport persistence and privacy boundaries |
| `npm run test:games` | Test game scoring and stored metrics |
| `npm run test:browser` | Run the Playwright end to end suite |

Playwright uses Microsoft Edge, starts the production server on port `3100`, and runs the mobile flows at a 360px viewport. The teacher view also has coverage at 320px and desktop width.

## Routes

| Route | Experience |
| --- | --- |
| `/` | Welcome screen or the returning student dashboard |
| `/onboarding` | Consent based voice and text profile questions |
| `/passport` | Editable Hunar Passport and employer preview |
| `/games` | Talent games and session controls |
| `/games/results` | Strength based game summary |
| `/comfort` | Learning comfort choices and live preview |
| `/careers` | Explainable career recommendations and comparison |
| `/roadmap` | Eight week learning and practice plan |
| `/opportunities` | Filters, village map, and application assistant |
| `/rewards` | Points, badges, milestones, and real reward links |
| `/circles` | Facilitator supervised learning groups |
| `/parent` | Family friendly audio summary |
| `/teacher` | Responsive fictional class dashboard |

## Project structure

```text
src/
├── app/          # App Router pages and global styles
├── components/   # Shared UI and feature components
├── data/         # Fictional student, career, plan, and opportunity data
└── lib/          # Store, i18n, recommendation rules, and utilities
public/
├── icons/        # PWA icons
├── manifest.json
├── offline.html
└── sw.js         # App shell service worker
tests/            # Unit and Playwright browser tests
```

## How the prototype works

Zustand persists the selected language, profile, consent choices, game sessions, comfort settings, chosen career, roadmap progress, saved opportunities, circle membership, rewards, and teacher demo actions in `localStorage`.

Career recommendations are deterministic rules over fictional data. A short delay presents the intended AI assisted experience without calling an external model. Match percentages and support confidence labels are illustrative and are never predictions or diagnoses.

The service worker caches public routes and static assets after a connected visit. Saved opportunity snapshots and student data remain in `localStorage`; they are not placed in the service worker cache. Clearing browser data resets the journey because the prototype has no cloud backup.

## Deploy to Vercel

1. Fork or push this repository to GitHub.
2. In Vercel, select **Add New → Project**.
3. Import the repository.
4. Select the **Next.js** framework preset.
5. Keep the default build and output settings.
6. Leave environment variables empty.
7. Deploy and open the HTTPS URL once while connected so the offline shell can install.

If this app sits inside a larger repository, set Vercel's **Root Directory** to the folder containing this `package.json`.

## Demo data disclaimer

All students, profiles, villages, distances, deadlines, programmes, eligibility results, income figures, success stories, support centres, and verification dates shown in HunarLoop are illustrative demo data.

Official links identify relevant provider portals. They do not verify the fictional listing or guarantee current eligibility, availability, funding, salary, admission, or employment. Users must confirm current details directly with the official provider before taking action.

---

Built as a hackathon prototype for inclusive, student controlled career exploration.
