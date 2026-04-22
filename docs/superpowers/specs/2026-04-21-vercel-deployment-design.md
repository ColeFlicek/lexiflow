# Vercel Deployment Design — LexiFlow

**Date:** 2026-04-21
**Status:** Approved

## Context

LexiFlow is a React 19 + Vite SPA currently deployed to GitHub Pages at the `/lexiflow/` sub-path. This spec covers adding Vercel as a parallel deployment target without removing GitHub Pages. Vercel serves the app at `lexiflow.vercel.app` (root path `/`). Production on Vercel is promoted manually; every push creates a preview deployment automatically.

The core challenge is that `vite.config.js` hardcodes `base: '/lexiflow/'` for GitHub Pages, but Vercel needs `base: '/'`. This is resolved by detecting the `VERCEL=1` env var that Vercel injects into every build automatically.

---

## Architecture

Two fully independent CI/CD pipelines in parallel:

| | GitHub Pages | Vercel |
|---|---|---|
| Trigger | Push to `main` (GitHub Actions) | Push to any branch (Vercel Git integration) |
| Base path | `/lexiflow/` | `/` |
| URL | `username.github.io/lexiflow/` | `lexiflow.vercel.app` |
| Production | Auto | Manual promotion |

---

## Code Changes

### `vite.config.js` — dynamic base path

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/lexiflow/',
})
```

### `src/main.jsx` — dynamic service worker path

Replace hardcoded `/lexiflow/sw.js` with `import.meta.env.BASE_URL` (Vite resolves this to the correct base at build time):

```js
navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
```

### `vercel.json` (new file) — SPA fallback routing

Required so that Vercel serves `index.html` for all paths instead of returning 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Vercel Project Setup (one-time, manual)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel link` in the project root and follow prompts to connect the GitHub repo
3. Framework, build command (`npm run build`), and output directory (`dist`) are all auto-detected
4. In Vercel dashboard → Settings → Git: disable auto-promotion to production

---

## Verification

1. **GitHub Pages still works:** Push to `main`, confirm GitHub Actions deploys to `/lexiflow/` URL as before.
2. **Vercel preview:** After `vercel link`, push a branch and confirm a preview URL is generated at `lexiflow-[hash].vercel.app` with the app loading at `/`.
3. **Service worker:** In browser DevTools → Application → Service Workers, confirm SW is registered at the correct scope (`/` on Vercel, `/lexiflow/` on GitHub Pages).
4. **SPA routing:** Navigate directly to `lexiflow.vercel.app/` and confirm it loads correctly.
5. **Manual production promotion:** From Vercel dashboard, promote a preview to production and confirm `lexiflow.vercel.app` reflects the latest build.
