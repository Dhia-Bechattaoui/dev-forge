import fs from 'fs';
import path from 'path';
import { communityComponents } from '@/components/community';
import * as motion from "framer-motion/client";
import ThemeToggle from '@/components/ThemeToggle';
import ContributorsGrid from '@/components/ContributorsGrid';
import DashboardStats from '@/components/DashboardStats';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 font-sans transition-colors duration-300">
      
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto flex justify-end mb-4">
        <ThemeToggle />
      </div>

      <main className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 pt-6"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome to <span className="text-blue-600 dark:text-blue-400">DevForge</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            An automated open-source playground designed for developers of all skill levels. Add your name to the JSON file to appear on this wall!
          </p>
        </motion.header>

        {/* Global Analytics Banner */}
        <DashboardStats contributors={contributors} totalComponents={communityComponents.length} />

        {/* Interactive Contributors Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Our Contributors</h2>
          <ContributorsGrid contributors={contributors} />
        </motion.section>

        {/* Advanced Components Grid */}
        <section className="pb-24">
          <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Advanced Components Showcase</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Custom React UI components built by experienced community contributors.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {communityComponents.map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {item.name}
                    </span>
                    <a 
                      href={`https://github.com/${item.author}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                      <img src={`https://github.com/${item.author}.png`} className="w-5 h-5 rounded-full" alt={item.author} />
                      by @{item.author}
                    </a>
                  </div>
                  
                  <div className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex items-center justify-center">
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
