# CodeMastery

A focused, open-source study desk for mastering C, Rust, Python, JavaScript, HTML/CSS, C++, R, and PostgreSQL.

## What is included

CodeMastery combines structured lessons, code examples, practice prompts, static shape checks, knowledge checks, local progress tracking, open documentation links, and a contextual Gemini tutor. The interface is designed as a calm developer workbench rather than a generic dashboard.

The tutor uses **bring your own key**. A learner may paste a restricted Gemini API key for the active tab. CodeMastery does not save it to the database, localStorage, source tree, or logs. The server validates requests, limits request size and rate, and never forwards provider error bodies to the browser. No public website can guarantee that a key pasted into a browser is completely safe, so use a restricted key with a small quota.

The Gemini key is sent to Google in a request header rather than a URL query string. Rate limiting uses the server-side socket address and does not trust a user-supplied forwarding header.

File uploads are intentionally disabled. The UI exposes no file picker or upload action, the server has no upload route, and file-like request content types are rejected before request parsing. This keeps malicious attachments out of the product boundary.

## Run locally

```bash
pnpm install
pnpm dev
```

The app runs on port `3000`. Use `pnpm check` for TypeScript diagnostics and `pnpm build` for the production bundle. The managed database is optional for the current local-progress experience; no API key is required to browse lessons.

## Project map

- `client/src/pages/Home.tsx` — curriculum, practice, checks, progress, and tutor UI.
- `client/src/index.css` — Terminal Atelier visual system and responsive layout.
- `server/_core/index.ts` — Express runtime and validated Gemini BYOK endpoint.
- `client/public/` — crawl metadata and route manifest.
- `plan.md` and `TODO.md` — design decisions and delivered scope.

## Documentation shelf

The UI links learners to free public references including The Rust Book, Python documentation, MDN, cppreference, R manuals, and PostgreSQL documentation. These links are learning aids; their respective authors and projects retain their own licenses.

## License

Copyright 2026 Playfulbug. CodeMastery is released under the [Apache License 2.0](LICENSE).
