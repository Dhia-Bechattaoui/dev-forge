import fs from 'fs';
import path from 'path';
import { TriviaGame, DevQuest } from '@/components/games';

export default function GamesPage() {
  // Read Data
  const triviaQuestions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/trivia.json'), 'utf8'));
  const rpgMonsters = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/rpg/monsters.json'), 'utf8'));
  const rpgItems = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/rpg/items.json'), 'utf8'));
  const rpgQuests = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/rpg/quests.json'), 'utf8'));

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          Interactive Games & Playground
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mb-4">
          Learn by playing, learn by contributing! Our games are powered entirely by open-source data. Add a question to the JSON files to expand the games.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
          <span className="font-bold">Public Developer API Live!</span>
          <span>You can fetch all of this game data to build your own apps. See the README for the REST endpoints.</span>
        </div>
      </header>

      <section className="mt-12">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">DevQuest: The RPG</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">A text-based RPG where every monster and item is contributed by the community.</p>
          </div>
        </div>
        
        <div className="w-full">
          <DevQuest monsters={rpgMonsters} items={rpgItems} quests={rpgQuests} />
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
