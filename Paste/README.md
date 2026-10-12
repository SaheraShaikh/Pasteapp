# Paste

A responsive React workspace for text notes and code snippets, built with Vite, Redux Toolkit, and Tailwind CSS.

## Run locally

```sh
cd Paste
npm ci
npm run dev
```

## Features

- Create, edit, view, and copy plain-text pastes.
- Search titles and content, and sort by date or title.
- Delete with a six-second Undo action.
- Keep editor drafts in the current tab across refreshes and navigation.
- Responsive layouts, keyboard focus indicators, reduced-motion support, and Ctrl/Cmd + Enter to save.
- Share Unicode-safe snapshots through copyable links or your device's share menu.
- Save a received snapshot to your own library.
- Handle missing pastes, malformed share links, and unavailable storage gracefully.

## Sharing and storage

Your library is saved in this browser's LocalStorage; there is no server or cross-device account. Existing pastes using the original `pastes` key are retained.

Share links contain a snapshot of the title and content in the URL fragment. Anyone with the link can read it; it is not encrypted and later edits do not update it. Links need a hosted app address to work on other devices; localhost links only work on the machine running the app. Large pastes exceeding the 16,000-character encoded payload limit fall back to sharing their text. Some messaging services may impose smaller URL limits.

Hash-based routing and relative build assets allow hosting the `dist` folder at a domain root or subfolder without route rewrite rules.

## Checks

```sh
npm run build
npm run lint
npm test
```
