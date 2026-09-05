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

## Importing players

Click **Import players** on the Players page and pick (or drag in) a CSV,
YAML, or JSON file. Known columns (name, jersey number, position, photo URL)
are auto-detected; anything else becomes a custom attribute — review and
adjust the mapping before confirming. Re-importing matches existing players
by jersey number (or name, if there's no number) and merges in changes
without deleting attributes you've entered by hand.

Try it with the fixtures in `sample-data/` (`players.csv`, `players.yaml`,
`players.json`) — each updates some of the built-in sample players and adds
a new one, and `players.csv` introduces a `Preferred Foot` column that isn't
in the built-in data, to demonstrate adding a field later.

## Schedule

The Schedule page works the same way: **Import games** accepts a CSV, YAML,
or JSON file with the same reviewable column-mapping flow, matching
existing games by date + opponent on re-import. Filter the list by team or
league with the dropdowns above it. Try `sample-data/games.csv`, which
updates one of the built-in sample games and adds two new ones (including a
`Referee` column not present in the built-in data).

## Squad dashboard

Pick a game on the Dashboard page, then drag players from **Available
players** onto the court to give them a position — as a formation board
split into **Angriff** (attack, 6 outfield positions) and **Verteidigung**
(defense, all 7 including the goalkeeper). Every player needs a position in
both halves, and they can be different — a player missing one is ringed
amber. Drag a placed player onto another spot to move or swap them, or drag
them back onto the pool to remove them from the squad entirely. Each game
keeps its own squad, saved as you go.

## Backup

Because all data lives in your browser's IndexedDB (no server), use the
export feature (coming in a later milestone) to save a JSON backup
periodically — clearing site data in your browser would otherwise lose your
data.

## Project status

Building incrementally by milestone; see the architecture plan for the full
roadmap. Currently: **squad dashboard — formation board with attack/defense
positions.**
