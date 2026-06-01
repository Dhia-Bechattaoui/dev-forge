'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface Contributor {
  name: string;
  github: string;
  language: string;
  role: string;
}

export default function ContributorsGrid({ contributors }: { contributors: Contributor[] }) {
  const [search, setSearch] = useState('');

  const filteredContributors = contributors.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.role.toLowerCase().includes(term) ||
      c.language.toLowerCase().includes(term) ||
      c.github.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-colors shadow-sm"
          placeholder="Search by name, role, or stack..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContributors.map((contributor) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              key={contributor.github}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={`https://github.com/${contributor.github}.png`}
                  alt={`${contributor.name}'s avatar`}
                  className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{contributor.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">@{contributor.github}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong className="dark:text-gray-300">Role:</strong> {contributor.role}</p>
                <p><strong className="dark:text-gray-300">Favorite Stack:</strong> {contributor.language}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredContributors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
          >
            <p className="text-lg font-medium">No contributors found matching "{search}" 😢</p>
            <p className="text-sm mt-1">Try searching for a different language or role!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
