# Welcome to your project

## Project info

This repository contains the source for the application. Edit files locally or in your preferred IDE.

## Local development

Requirements: Node.js and npm (or yarn).

Quick start:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

Build for production with:

```sh
npm run build
```

Serve the `dist` folder with any static hosting provider.

## Custom domain

Configure your hosting provider's domain settings to point to the deployed `dist` site.

## Supabase OAuth redirect setup

- **Android (native app)**: Add the custom scheme redirect `com.karansonimj.hydrationhelper://auth-callback` to your Supabase project's list of Redirect URLs. The Android app already has an intent-filter to handle this scheme. After updating Supabase, run:

```bash
npx cap sync android
# Rebuild the Android app in Android Studio or via CLI
```

- **Web / Development**: Add your web origin (for example `http://localhost:5173` during local dev or your production domain `https://example.com`) to Supabase Redirect URLs so OAuth from a browser redirects back to the correct site.

- **iOS (if applicable)**: If you target iOS, add a URL scheme matching `com.karansonimj.hydrationhelper` in Xcode (`Info.plist` -> URL types) or configure the appropriate Associated Domains for universal links.

Make sure both the custom scheme and the web origin are listed in your Supabase project's Redirect URLs; otherwise OAuth flows may open the browser instead of returning to the app.
