# Emerion Dashboard – PRD

## Original problem statement
1. "read the git repo which is written in React. Add dark theme capability to it"
2. "create a brand new login page to be used rather than the amazon default one" (Cognito pool eu-north-1_NtDQLSmuT, client 395rpr7l5274ei0ivbjm6l2ptd)

## Stack
React 19 + TypeScript + Vite + Tailwind v4 at /app root (run with `npm run dev`). ERP REST API (external, localhost:8080). Auth: AWS Cognito via amazon-cognito-identity-js (SRP).

## User choices
- Theme: toggle button in the top bar; follows the device setting at first, then remembers the user's choice; brand colours darkened.
- Login: email + password sign-in, plus forgot password (code by email). No AWS changes were needed (SRP is already enabled).

## Implemented (Oct 2026)
- Semantic theme tokens (src/index.css) with `.dark` overrides; a codemod replaced hard-coded hex classes; recharts dark-mode CSS; ThemeProvider/ThemeToggle (src/theme); no-flash script in index.html; toggle in TopBar, LandingPage and LoginPage.
- Custom login at /login (src/pages/login/*), AuthContext + cognito service (src/auth/*); react-oidc-context and oidc-client-ts removed; sign out returns to /login; tokens are refreshed every 4 min.
- Env: VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID in /app/.env; vite `define: { global: "globalThis" }`.

## Backlog
- P1: "Set new password" challenge screen for users with temporary passwords.
- P1: MFA challenge screen.
- P2: globalSignOut option; "remember me" (session-only storage).
