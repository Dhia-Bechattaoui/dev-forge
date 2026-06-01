import fs from 'fs';
import path from 'path';
import { communityComponents } from '@/components/community';

// Define the interface for our contributor data
interface Contributor {
  name: string;
  github: string;
  language: string;
  role: string;
}

export default function Home() {
  // Read the contributors data from the JSON file
  const dataPath = path.join(process.cwd(), 'data/contributors.json');
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const contributors: Contributor[] = JSON.parse(fileContents);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <main className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="text-center space-y-4 pt-12">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Welcome to <span className="text-blue-600">DevForge</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            An automated open-source playground designed for developers of all skill levels. Add your name to the JSON file to appear on this wall!
          </p>
        </header>

        {/* Contributors Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Contributors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {contributors.map((contributor) => (
              <div 
                key={contributor.github} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {/* Fetching GitHub Avatar dynamically */}
                  <img 
                    src={`https://github.com/${contributor.github}.png`} 
                    alt={`${contributor.name}'s avatar`} 
                    className="w-12 h-12 rounded-full border border-gray-200"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{contributor.name}</h3>
                    <p className="text-sm text-blue-600">@{contributor.github}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Role:</strong> {contributor.role}</p>
                  <p><strong>Favorite Stack:</strong> {contributor.language}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Components Grid */}
        <section className="pb-24">
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Advanced Components Showcase</h2>
            <p className="text-gray-600 mb-8">Custom React UI components built by experienced community contributors.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {communityComponents.map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {item.name}
                    </span>
                    <a 
                      href={`https://github.com/${item.author}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <img src={`https://github.com/${item.author}.png`} className="w-5 h-5 rounded-full" alt={item.author} />
                      by @{item.author}
                    </a>
                  </div>
                  
                  <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center">
                    {/* Render the community component dynamically */}
                    <item.component />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
