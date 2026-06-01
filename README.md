# DevForge

> The open-source playground where every feature is powered by community contributions.

DevForge is a live, interactive developer platform built with **Next.js 15**. Every game you can play, every card on the dashboard, and every trivia question you answer was contributed by someone just like you. This is a safe, beginner-friendly space to learn Git, GitHub, and open-source collaboration.

---

## What Can You Contribute?

| Contribution Type | Difficulty | What You Need |
|---|---|---|
| Add your Contributor Profile | Beginner | GitHub account only |
| Add a Trivia Question | Beginner | Basic JSON |
| Submit a CodeBot | Beginner | Basic JSON |
| Add a Typing Snippet | Beginner | Basic JSON + some code |
| Design a CSS Puzzle Level | Intermediate | CSS knowledge |
| Add an RPG Monster / Item / Quest | Beginner | Basic JSON |
| Build a Community React Component | Advanced | React, TypeScript, Tailwind |

**[Read the full step-by-step Contribution Guide →](CONTRIBUTING.md)**

---

## Interactive Games Hub

DevForge hosts a collection of community-powered mini-games at `/games`. Every game is data-driven — just add entries to a JSON file to expand the content!

| Game | Data File | What it Does |
|---|---|---|
| **DevForge Trivia** | `data/trivia.json` | Community trivia questions |
| **CodeBot Auto-Battler** | `data/bots.json` | Submit a stat-based combat bot |
| **DevType** | `data/snippets.json` | Type code snippets, test your WPM |
| **CSS Puzzle Game** | `data/css-puzzles.json` | Design layout challenges |
| **DevQuest RPG** | `data/rpg/` | Monsters, items, and quests |

---

## Public Developer API

All DevForge game data is exposed via open, CORS-enabled REST endpoints. Use them in your own projects!

```javascript
// Contributor list
const res = await fetch('https://dev-forge.bechattaoui.dev/api/contributors');
const { data, count } = await res.json();

// Trivia Questions
const trivia = await fetch('https://dev-forge.bechattaoui.dev/api/games/trivia').then(r => r.json());

// DevQuest RPG Data
const monsters = await fetch('https://dev-forge.bechattaoui.dev/api/games/rpg/monsters').then(r => r.json());
const items    = await fetch('https://dev-forge.bechattaoui.dev/api/games/rpg/items').then(r => r.json());
const quests   = await fetch('https://dev-forge.bechattaoui.dev/api/games/rpg/quests').then(r => r.json());
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 (App Router) | Framework |
| React | 19 | UI Library |
| TypeScript | 5 | Type Safety |
| Tailwind CSS | 4 | Styling |
| Framer Motion | latest | Animations |
| Vitest | latest | Automated Testing |
| GitHub Actions | — | CI/CD Pipeline |

---

*If you find DevForge useful, please give it a ⭐ Star to help other developers discover it!*
