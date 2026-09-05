# Handball Team App

A small, local-only web app for managing a handball team: player profiles, a
game schedule, and a drag-and-drop squad-builder dashboard. No backend, no
login — everything runs in your browser.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React Router](https://reactrouter.com) for the Players / Schedule / Dashboard views
- [Zustand](https://github.com/pmndrs/zustand) for state
- [Dexie.js](https://dexie.org) (IndexedDB) for local persistence
- [PapaParse](https://www.papaparse.com) / [js-yaml](https://github.com/nodeca/js-yaml) for CSV/YAML import
- [dnd-kit](https://dndkit.com) for the drag-and-drop squad builder

## Getting started

```sh
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Data model

Player and Game records promote a few fields the UI needs directly typed
access to (e.g. `name`, `jerseyNumber`, `position` for players), and store
everything else — custom columns from an import, strengths/weaknesses you add
by hand, anything — in a freeform `attributes` bag. This means adding a new
column to your source CSV/YAML/JSON file and re-importing never requires a
schema change.

## Backup

Because all data lives in your browser's IndexedDB (no server), use the
export feature (coming in a later milestone) to save a JSON backup
periodically — clearing site data in your browser would otherwise lose your
data.

## Project status

Building incrementally by milestone; see the architecture plan for the full
roadmap. Currently: **M1 — scaffold + static player list.**
