# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands
- Development: `npm run dev` (starts Vite server)
- Build: `npm run build` (production build)
- Android: `npm run cap:android` (build Android app)
- iOS: `npm run cap:ios` (build iOS app)
- Vercel deploy: `npm run vercel:deploy`

## Code Style Guidelines
- Use React functional components with hooks
- Maintain a clean component hierarchy (pages → layouts → components)
- State management through React Context (AuthContext, NetworkContext, ScannerContext)
- Lazy-load components for performance optimization
- Use consistent error handling with try/catch blocks
- Implement proper offline handling using NetworkContext
- Follow ESLint configurations in eslint.config.js

## Import Order
1. React and React-related libraries
2. Third-party libraries
3. Local components
4. Contexts
5. Utils/helpers
6. Assets/styles

## Naming Conventions
- Components: PascalCase (e.g., ScannerComponent.jsx)
- Contexts: PascalCase + Context (e.g., AuthContext.jsx)
- Utilities: camelCase (e.g., platform.js)
- Files: descriptive names reflecting purpose