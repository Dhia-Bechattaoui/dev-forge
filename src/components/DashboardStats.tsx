'use client';

import { Users, Component, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface Contributor {
  name: string;
  github: string;
  language: string;
  role: string;
}

export default function DashboardStats({ contributors, totalComponents }: { contributors: Contributor[], totalComponents: number }) {
  
  // Calculate the most popular tech stack
  const languageCounts = contributors.reduce((acc, curr) => {
    acc[curr.language] = (acc[curr.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let topLanguage = 'None';
  let maxCount = 0;
  for (const [lang, count] of Object.entries(languageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topLanguage = lang;
    }
  }

  const stats = [
    {
      title: "Total Contributors",
      value: contributors.length,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-900/50"
    },
    {
      title: "Community Widgets",
      value: totalComponents,
      icon: Component,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-900/50"
    },
    {
      title: "Top Tech Stack",
      value: topLanguage,
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-900/50"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={stat.title}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border ${stat.border} flex items-center space-x-4 transition-all`}
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h4>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
