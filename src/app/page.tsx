import fs from 'fs';
import path from 'path';
import { communityComponents } from '@/components/community';
import * as motion from "framer-motion/client";
import DashboardStats from '@/components/DashboardStats';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Contributor {
  name: string;
  github: string;
  language: string;
  role: string;
}

export default function Home() {
  const dataPath = path.join(process.cwd(), 'data/contributors.json');
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const contributors: Contributor[] = JSON.parse(fileContents);

  return (
    <>
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
          An automated open-source playground designed for developers of all skill levels.
        </p>
      </motion.header>

      <DashboardStats contributors={contributors} totalComponents={communityComponents.length} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
      >
        <Link href="/contributors" className="group p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
            Contributors Grid
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </h3>
          <p className="text-gray-600 dark:text-gray-400">View the community wall and search for developers by tech stack.</p>
        </Link>
        
        <Link href="/showcase" className="group p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
            Advanced Showcase
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Explore complex React components built by the community.</p>
        </Link>
      </motion.div>
    </>
  );
}
