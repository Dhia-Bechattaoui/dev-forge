# DevForge

Welcome to **DevForge** — the fully automated, beginner-friendly open-source playground! 

Have you ever wanted to contribute to open source but felt intimidated? Are you looking for a safe, easy place to make your very first Pull Request? You are in the right place! 

Our goal is to help developers of all skill levels learn Git, GitHub, and Open Source collaboration.

## How it Works

DevForge is a live Next.js dashboard. Whenever a contributor adds their information to our data file, our automated GitHub Actions validate the code, automatically approve the Pull Request, and instantly publish their "Contributor Card" to the live website!

### Beginner Tier: Add Your Name to the Wall!
You can make your first open-source contribution in less than 2 minutes without writing any code. All you need to do is edit a simple JSON file.

**[Click here to read the Step-by-Step Beginner Guide!](CONTRIBUTING.md)**

### Advanced Tier: Build a Component!
If you already know React, TypeScript, and Tailwind CSS, you can show off your skills by submitting a custom UI Component to the `components/community/` directory!

1. Fork the repo and clone it locally.
2. Run `npm install` and `npm run dev`.
3. Create a stunning new component in `components/community/`.
4. Open a PR and our automated systems will review your code!

## Public Developer API

DevForge provides public, open REST API endpoints so you can fetch our community-driven data and use it in your own external applications! All endpoints support CORS.

### Contributor API
```javascript
// Fetch the list of DevForge contributors
const response = await fetch('https://dev-forge.bechattaoui.dev/api/contributors');
const { data, count } = await response.json();
```

### Game Data APIs
```javascript
// Fetch Trivia Questions
const trivia = await fetch('https://dev-forge.bechattaoui.dev/api/games/trivia').then(res => res.json());

// Fetch DevQuest RPG Data
const monsters = await fetch('https://dev-forge.bechattaoui.dev/api/games/rpg/monsters').then(res => res.json());
const items = await fetch('https://dev-forge.bechattaoui.dev/api/games/rpg/items').then(res => res.json());
const quests = await fetch('https://dev-forge.bechattaoui.dev/api/games/rpg/quests').then(res => res.json());
```

## Built With
- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS**
- **GitHub Actions** (Fully automated CI/CD pipeline)

---
*If you like this project, please consider giving it a Star to help other beginners find it!*
