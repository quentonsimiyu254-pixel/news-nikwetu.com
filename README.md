<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/36497696-24e3-439b-acd5-063693d1488c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Environment variables

- Use a `.env.local` file for secrets and local overrides (do NOT commit it).
- Vite exposes only variables prefixed with `VITE_` to client-side code. Example keys used by this project:
   - `VITE_APP_TITLE` — site title shown in the UI
   - `VITE_API_URL` — optional API base URL
   - `VITE_GA_ID` — analytics tracking ID

Copy `.env.example` to `.env.local` and update values before running.
