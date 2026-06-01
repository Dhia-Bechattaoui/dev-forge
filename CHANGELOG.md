# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-01

### Added
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
