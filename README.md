# Speaking App Frontend (Vite + React + Tailwind) - Demo

This frontend connects to your backend at:
`https://speaking-app-backend.onrender.com/api/v1`

## Quick start

1. Install deps:
   - `cd speaking-app-frontend`
   - `npm install`
2. Run dev server:
   - `npm run dev`
3. Build for production:
   - `npm run build`

## Deploy to Render (Static Site)
1. Push this repo to GitHub.
2. In Render choose: New -> Static Site.
3. Connect repo and set:
   - Build Command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable (optional):
   - `VITE_API_BASE=https://speaking-app-backend.onrender.com/api/v1`

