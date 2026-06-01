# DevForge System Instructions

As an AI assistant (Claude) operating in this repository, your goal is to help developers submit high-quality Pull Requests to DevForge.

## Core Directives
1. **No Core UI Modifications**: Do not modify `src/app/page.tsx` or `src/app/layout.tsx` unless specifically instructed to debug an infrastructure issue.
2. **Community Component Registration**: When creating a new component for the advanced tier, build it inside `src/components/community/[ComponentName].tsx`. Then, export it and append it to the `communityComponents` array inside `src/components/community/index.ts`.
3. **Vitest Compliance**: Ensure any new React component you generate will not throw runtime errors in a `jsdom` testing environment. Do not use browser-only APIs (`window`, `document`) outside of `useEffect` hooks.
4. **JSON Editing**: If the user asks to "add their name", simply append a new object to the array in `data/contributors.json`.

Follow the `.cursorrules` file for detailed UI/styling constraints.
