# Development Setup & Debugging Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- Access to Supabase project (configured in `.env.local`)

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:3000` (or next available port if busy)
   - HMR (hot reload) enabled on localhost

4. **Type checking**
   ```bash
   npm run type-check
   ```

## Troubleshooting

### "Port 3000 in use" Error
- Vite is configured to auto-increment ports (3001, 3002, etc.)
- If you need a specific port, edit `vite.config.ts` and set `strictPort: true`
- Or kill existing Node process: `taskkill /IM node.exe /F`

### 404 Errors on First Load
- Ensure `src/main.tsx` exists (entry point)
- Check `index.html` has correct script path: `<script type="module" src="/src/main.tsx"></script>`
- Clear browser cache and reload

### Build Failed / TypeScript Errors
- Run `npm run lint` to check for type issues
- Fix any import paths—the project uses root-level imports (e.g., `import App from './App'`), not `src/App`

### Supabase Connection Issues
- Verify credentials in `.env.local`
- Check Supabase project is active and URL is correct
- See `sql/supabase_schema.sql` for required tables

## File Structure

```
project-root/
├── src/
│   └── main.tsx          # React app entry point (loaded by index.html)
├── App.tsx               # Root component with routing
├── components/           # Reusable UI components
├── pages/                # Page components (Home, Article, etc.)
├── services/             # Business logic (cmsService, supabase)
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies
└── sql/
    └── supabase_schema.sql  # Database schema for Supabase
```

## Environment Variables

| Variable | Type | Example |
|----------|------|---------|
| `VITE_SUPABASE_URL` | Public | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public | JWT anon key from Supabase |
| `VITE_APP_TITLE` | Public | `News Nikwetu` |
| `VITE_API_URL` | Public | `https://api.example.com` |
| `VITE_GA_ID` | Public | Google Analytics ID |

Only variables prefixed with `VITE_` are available in client code.

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run type-check   # Run TypeScript compiler check
npm run lint         # Lint TypeScript (type-check)
```

## Debugging Tips

1. **Check browser DevTools Console** for runtime errors
2. **Check Network tab** to see which resources fail (404s, CORS, etc.)
3. **Use `console.log` in React components** to debug state/props
4. **Inspect Supabase queries** in `services/cmsService.ts` — errors are logged with `console.error()`
5. **Verify `.env.local` exists and has valid values** — app won't connect to Supabase without it

---

For more info, see [Vite docs](https://vitejs.dev) and [Supabase docs](https://supabase.com/docs).
