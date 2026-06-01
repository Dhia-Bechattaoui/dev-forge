# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
