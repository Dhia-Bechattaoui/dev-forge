import fs from 'fs';
import path from 'path';
import { TriviaGame, DevQuest } from '@/components/games';

export default function GamesPage() {
  // Read Data
  const triviaQuestions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/trivia.json'), 'utf8'));
  const rpgMonsters = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/rpg/monsters.json'), 'utf8'));
  const rpgItems = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/rpg/items.json'), 'utf8'));

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          Interactive Games & Playground
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Learn by playing, learn by contributing! Our games are powered entirely by open-source data. Add a question to the JSON files to expand the games.
        </p>
      </header>

      <section className="mt-12">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">DevQuest: The RPG</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">A text-based RPG where every monster and item is contributed by the community.</p>
          </div>
        </div>
        
        <div className="w-full">
          <DevQuest monsters={rpgMonsters} items={rpgItems} />
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">DevForge Trivia Engine</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Powered by {triviaQuestions.length} community questions from data/trivia.json</p>
          </div>
        </div>
        
        <div className="w-full">
          <TriviaGame questions={triviaQuestions} />
        </div>
      </section>
    </div>
  );
}
