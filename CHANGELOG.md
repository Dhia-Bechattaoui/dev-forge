# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-06-01

### Added
- **CSS Layout Puzzle Game**: Launched a new interactive layout challenge game on the Games Hub. Contributors design puzzle levels in `data/css-puzzles.json`. The game features a live split-pane editor with a real-time CSS preview that animates boxes as the user types valid properties using Framer Motion layout animations.
- **Strict CSS Validation Engine**: The puzzle engine parses raw CSS text and validates against a `requiredStyles` map, ensuring all required properties are present. Deleting a required base property (like `display: flex`) immediately un-solves the puzzle.
- **Complete Documentation Overhaul**: Rewrote `README.md` and `CONTRIBUTING.md` from scratch to document all contribution pathways — contributor profiles, trivia questions, CodeBot stats, DevType snippets, CSS puzzle levels, and RPG monsters/items/quests — each with copy-pasteable JSON schemas and field explanations.

### Fixed
- **CSS Puzzle Editor Overlap**: Replaced the broken absolute-positioned `#container {` label in the code editor with a proper stacked flex-column layout, eliminating text overlap with the textarea.

## [1.4.0] - 2026-06-01

### Added
- **DevType (Code Typing Speed Tester)**: Launched a new data-driven typing game on the Games Hub! Contributors can add target code snippets to `data/snippets.json`. Features a highly visible, pulsing block cursor and auto-indentation on newlines to mimic a real code editor. 
- **Live Net WPM & Accuracy Engine**: The DevType engine automatically tracks true "Net WPM" (permanently docking words-per-minute and accuracy scores for typos). WPM updates dynamically via an invisible background timer for smooth, real-time performance feedback without interval tearing.

## [1.3.0] - 2026-06-01

### Added
- **CodeBot Auto-Battler**: Built an advanced, data-driven community game on the Games Hub. Contributors configure their own Bots via `data/bots.json`. The game features an Active Time Battle (ATB) engine where attack speeds scale proportionally with bot stats, complete with an auto-balancing mathematical normalizer, dodge mechanics, and Framer Motion impact animations.

## [1.2.0] - 2026-06-01

### Added
- **Scalable UI Architecture**: Transitioned the single-page application into a multi-page routing system. Introduced a persistent `Sidebar` component for global navigation.
- **Dedicated Routes**: Created dedicated full-page routes for `/contributors` and `/showcase` to give community content more breathing room. Refactored the root `/` path into a clean Dashboard Overview.
- **Git & GitHub Interactive Cheat Sheet**: Built a highly interactive, beginner-friendly community component featuring an animated Git Data Flow diagram, search filtering, categorized tabs, and one-click command copying. Fully tested with Vitest.
- **Interactive Games Hub**: Created a new `/games` route and Sidebar link to serve as a hub for community-built interactive games.
- **Dynamic Dashboard Stats**: Completely overhauled the root dashboard (`page.tsx`) to dynamically read from the JSON data. The `DashboardStats` component was updated to a 4-card grid layout that now displays live counts for the RPG Database Size and Trivia Questions.
- **Public Game APIs**: Built and deployed open, CORS-enabled REST API endpoints (`/api/games/trivia`, `/api/games/rpg/monsters`, etc.) to allow external developers to fetch and use DevForge's community-driven data in their own applications.
- **DevQuest (The Open-Source RPG)**: Built a turn-based RPG engine (`DevQuest.tsx`) on the Games Hub. The entire game universe is powered by community-contributed JSON files (`monsters.json`, `items.json`, `quests.json`). Features level-scaling, roguelike mechanics, Framer Motion combat animations, an interactive Backpack inventory system for manual item management, and real-time Quest tracking with automated reward drops.
- **Algorithm Visualizer Sandbox**: Built an interactive sandbox (`AlgorithmVisualizer.tsx`) that visually animates sorting algorithms (like Bubble Sort) in real-time using Framer Motion. Features playback controls, speed adjustment, and dynamic highlighting.
- **The DevForge Trivia Engine**: Built an animated, data-driven Trivia Game (`TriviaGame.tsx`) powered by Framer Motion. Community members can now contribute by simply appending questions to `data/trivia.json`. Includes dynamic feedback for perfect scores and automated Vitest coverage.
## [1.1.0] - 2026-06-01

### Added
- **SEO & Social Graph Optimization**: Replaced default Next.js metadata in `layout.tsx` with highly optimized DevForge metadata. Added Open Graph (OG) and Twitter Card tags to ensure the platform URL unfurls into a beautiful preview card on social media (LinkedIn, Twitter, Discord).
- **Automated UI Testing**: Integrated Vitest and React Testing Library (`jsdom`) to automatically test React components. Added `__tests__/DashboardStats.test.tsx` and updated the `validate.yml` GitHub Action to block any Pull Requests that fail the UI tests.
- **Public Developer API**: Built a native Next.js 15 Route Handler (`/api/contributors`) that securely serves the open-source contributor database via a JSON endpoint with CORS headers. Added documentation in the README for external integrations.
- **Global Analytics Banner**: Built a dynamic `DashboardStats` component that calculates and displays Total Contributors, Total Community Widgets, and the Top Tech Stack in real-time.
- **Live Search & Filtering**: Refactored the contributor grid into an interactive Client Component (`ContributorsGrid.tsx`) featuring a live search bar that instantly filters by name, role, language, or GitHub username. Added Framer Motion `layout` animations for smooth grid resizing during searches.
- **Dark Mode Support**: Fully integrated `next-themes` and added a custom `ThemeToggle` component to the dashboard header. Fixed global Tailwind CSS v4 variables to support manual dark mode toggling.
- **Advanced Animations**: Installed `framer-motion` to add smooth, premium entry and hover animations to the main dashboard layout and contributor cards.
- **Interactive Community Widget**: Built the `GithubStatsCard`, which fetches and displays real-time GitHub repository and follower counts from the GitHub API. Added it to the Advanced Component Showcase.
- **Automated Welcome Bot**: Created a new GitHub Action (`welcome-bot.yml`) that automatically comments on new Pull Requests to warmly welcome contributors.

## [1.0.0] - 2026-06-01

### Added
- **Next.js App Router Foundation**: Initialized the core project using Next.js 15, React 19, and Tailwind CSS.
- **Two-Tier Contribution System**: 
  - *Beginner Tier*: Created `data/contributors.json` for easy, data-only contributions.
  - *Advanced Tier*: Created `src/components/community/` directory with a dynamic registry for developers to submit custom React components.
- **Automated CI/CD Workflows**:
  - `validate.yml`: GitHub Action to automatically lint the codebase and validate JSON syntax on every Pull Request.
  - `auto-merge.yml`: GitHub Action to automatically approve and squash-merge valid data contributions.
- **AI Agent Guidelines**:
  - Added `.agents/rules/` for tech-stack and code-style constraints to guide AI generation.
  - Added `.agents/workflows/` defining the step-by-step build process for the AI assistant.
- **Dynamic Dashboard UI**: Built `src/app/page.tsx` to automatically read and display contributor data and render advanced community components dynamically.
- **Onboarding Documentation**: Added a comprehensive `README.md` and a step-by-step beginner `CONTRIBUTING.md` guide.

[1.5.0]: https://github.com/Dhia-Bechattaoui/dev-forge/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/Dhia-Bechattaoui/dev-forge/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/Dhia-Bechattaoui/dev-forge/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Dhia-Bechattaoui/dev-forge/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Dhia-Bechattaoui/dev-forge/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Dhia-Bechattaoui/dev-forge/releases/tag/v1.0.0
