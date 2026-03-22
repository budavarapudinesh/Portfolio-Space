# Budavarapu Dinesh — Portfolio

Personal portfolio built with Next.js 16, React 19, Three.js, and Framer Motion. Features a real-time 3D neural network visualization with a holographic wireframe head at the output layer.

## Tech Stack

- **Framework:** Next.js 16.1 (App Router)
- **3D Rendering:** Three.js + @react-three/fiber + @react-three/drei
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Email:** Resend API
- **Language:** TypeScript (strict)

## Features

- Interactive 3D neural network visualization (4-trillion-parameter scale)
- Holographic wireframe human head with talking animation and scan-line effect
- Dark / light mode with localStorage persistence
- Pages: Home, About, Work, Designs, Certifications, Contact
- Contact form with validation and email delivery via Resend
- Per-page SEO metadata + OG tags
- Sitemap and robots.txt generated at build time
- Error boundary and 404 page

## Getting Started

```bash
npm install
npm run dev           # http://localhost:3000
npm run build         # production build
npm test              # run tests
npm run test:coverage # coverage report
```

## Environment Variables

Create `.env.local` for local development:

```
RESEND_API_KEY=re_...
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home (3D scene)
│   ├── about/                # Bio, skills, certifications
│   ├── work/                 # Project showcase
│   ├── designs/              # Design portfolio
│   ├── certifications/       # Certifications list
│   ├── contact/              # Contact form
│   ├── api/contact/          # Resend email route
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── robots.ts             # robots.txt
│   ├── not-found.tsx         # 404 page
│   └── error.tsx             # Error boundary
└── components/
    ├── mind-map.tsx           # 3D neural network (~1010 lines)
    ├── profile-scene.tsx      # Three.js canvas wrapper
    ├── sidebar.tsx            # Navigation sidebar
    ├── nav-bar.tsx            # Top bar with theme toggle
    └── theme-provider.tsx     # Dark/light context
```
