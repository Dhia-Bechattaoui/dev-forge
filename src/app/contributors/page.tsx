import fs from 'fs';
import path from 'path';
import ContributorsGrid from '@/components/ContributorsGrid';

interface Contributor {
  name: string;
  github: string;
  language: string;
  role: string;
}

export default function ContributorsPage() {
  const dataPath = path.join(process.cwd(), 'data/contributors.json');
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const contributors: Contributor[] = JSON.parse(fileContents);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Our Contributors</h1>
        <p className="text-gray-600 dark:text-gray-400">Search and explore the amazing developers who have contributed to DevForge.</p>
      </header>
      
      <ContributorsGrid contributors={contributors} />
    </div>
  );
}
