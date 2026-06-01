import fs from 'fs';
import path from 'path';
import { TriviaGame } from '@/components/games';

export default function GamesPage() {
  const dataPath = path.join(process.cwd(), 'data/trivia.json');
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const triviaQuestions = JSON.parse(fileContents);

  return (
    <div className="space-y-8">
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
