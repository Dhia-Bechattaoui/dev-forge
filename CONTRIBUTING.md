# Contributing to DevForge

Welcome! DevForge is built for contributors of all skill levels. Whether you are making your first open-source contribution or you are a seasoned developer, there is a place for you here.

We have automated the review process. If your JSON is valid and your code follows the guidelines, your Pull Request will be reviewed and merged quickly!

---

## Table of Contents

- [Tier 1: Add Your Contributor Profile](#tier-1-add-your-contributor-profile)
- [Tier 2: Contribute Game Data](#tier-2-contribute-game-data)
  - [Trivia Questions](#trivia-questions)
  - [CodeBot Auto-Battler](#codebot-auto-battler)
  - [DevType Code Snippets](#devtype-code-snippets)
  - [CSS Puzzle Levels](#css-puzzle-levels)
  - [DevQuest RPG Data](#devquest-rpg-data)
- [Tier 3: Build a Community Component](#tier-3-build-a-community-component)
- [General Pull Request Guidelines](#general-pull-request-guidelines)

---

## Tier 1: Add Your Contributor Profile

**Difficulty: Beginner — No local setup required!**

You can do this entirely in your browser in under 2 minutes.

1. **Fork** this repository by clicking the Fork button in the top-right corner.
2. In your fork, navigate to `data/contributors.json` and click the pencil (edit) icon.
3. Add your entry at the end of the JSON array:

```json
{
  "name": "Your Full Name",
  "github": "YourGitHubUsername",
  "language": "TypeScript",
  "role": "Full-Stack Developer"
}
```

4. Commit your change with the message: `data-update: add @YourGitHubUsername contributor profile`
5. Open a Pull Request back to the main repository.

Your Contributor Card will appear on the live site automatically after merge!

---

## Tier 2: Contribute Game Data

All games on DevForge are powered by JSON files in the `data/` directory. No React knowledge required — just valid JSON!

### Trivia Questions

**File:** `data/trivia.json`

Add a new multiple-choice question to the trivia engine:

```json
{
  "question": "Which CSS property is used to create a flex container?",
  "options": ["display: flex", "position: flex", "flex: true", "layout: flex"],
  "answer": "display: flex"
}
```

- `question`: The question string.
- `options`: An array of exactly 4 answer strings.
- `answer`: Must exactly match one of the strings in `options`.

---

### CodeBot Auto-Battler

**File:** `data/bots.json`

Submit your own combat bot to fight in the arena. Bots are auto-balanced by the engine, so the total of all stats must not exceed **150 points**. Distribute wisely!

```json
{
  "id": "b4",
  "name": "My Bot Name",
  "author": "YourGitHubUsername",
  "stats": {
    "hp": 60,
    "attack": 40,
    "defense": 20,
    "speed": 30
  }
}
```

- `id`: Must be unique (e.g., `b4`, `b5`).
- `hp`: Hit Points. Higher HP means your bot survives longer.
- `attack`: Damage dealt per hit.
- `defense`: Reduces incoming damage.
- `speed`: Controls ATB (Active Time Battle) tick rate — higher speed attacks more frequently!

---

### DevType Code Snippets

**File:** `data/snippets.json`

Add a real code snippet for developers to type against:

```json
{
  "id": "s4",
  "language": "TypeScript",
  "author": "YourGitHubUsername",
  "code": "function greet(name: string): string {\n  return `Hello, ${name}!`;\n}"
}
```

- `id`: Must be unique (e.g., `s4`, `s5`).
- `language`: The display label shown on the snippet card (e.g., `JavaScript`, `Python`, `CSS`).
- `code`: The raw code string. Use `\n` for newlines and `  ` (two spaces) for indentation. Do NOT use tabs.
- Keep snippets between **50–200 characters** for a good typing experience.

---

### CSS Puzzle Levels

**File:** `data/css-puzzles.json`

Design a layout challenge for other developers to solve by writing CSS:

```json
{
  "id": "p4",
  "title": "Push to the Right",
  "author": "YourGitHubUsername",
  "description": "Use Flexbox to push the single box all the way to the right side of the container.",
  "initialCss": "display: flex;\n",
  "htmlStructure": "<div class='box box-1'></div>",
  "requiredStyles": {
    "justify-content": "flex-end"
  }
}
```

- `id`: Must be unique (e.g., `p4`, `p5`).
- `title`: Short puzzle name.
- `description`: Explain what the player must achieve visually.
- `initialCss`: The CSS the player starts with. Always include `display: flex;\n` as a base for Flexbox puzzles.
- `htmlStructure`: The HTML boxes rendered in the preview. Use `<div class='box box-1'></div>` for 1 box, add `box-2`, `box-3` for multiple boxes.
- `requiredStyles`: A key-value map of every CSS property-value pair the player must type to win. Values must be lowercase.

---

### DevQuest RPG Data

**File:** `data/rpg/monsters.json`, `data/rpg/items.json`, `data/rpg/quests.json`

Contribute monsters, items, or quests to the RPG engine.

**Monster:**
```json
{
  "id": "m5",
  "name": "The Null Pointer",
  "hp": 80,
  "attack": 18,
  "reward": { "xp": 45, "gold": 20 }
}
```

**Item:**
```json
{
  "id": "i5",
  "name": "Rubber Duck",
  "type": "consumable",
  "effect": "heal",
  "value": 30,
  "description": "Explain the bug to it. Somehow, you feel better."
}
```

**Quest:**
```json
{
  "id": "q4",
  "title": "Slay the Stack Overflow",
  "description": "A recursive beast has nested itself 10,000 levels deep.",
  "goal": { "type": "kills", "count": 3 },
  "reward": { "xp": 120, "gold": 60, "item": "i5" }
}
```

---

## Tier 3: Build a Community Component

**Difficulty: Advanced — Requires React, TypeScript, and Tailwind CSS knowledge.**

1. Fork and clone the repository locally.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Create your component inside `src/components/community/`.
5. Your component must follow the project's code style rules (see `.agents/rules/code-style.md`):
   - Use strict TypeScript with defined interfaces for all props.
   - Use Tailwind CSS for all styling.
   - Write beginner-friendly comments explaining complex logic.
6. Register your component in `src/components/community/index.ts` and add it to the `src/app/showcase/page.tsx` page so it renders on the live site.
7. Open a Pull Request with a clear description of what your component does.

---

## General Pull Request Guidelines

- Use clear, descriptive commit messages (e.g., `data-update: add trivia question about React hooks`).
- One contribution type per Pull Request — don't mix data changes with code changes.
- Validate your JSON is properly formatted before submitting (use [jsonlint.com](https://jsonlint.com)).
- Be kind, patient, and constructive in code review discussions.

Thank you for contributing to DevForge!
