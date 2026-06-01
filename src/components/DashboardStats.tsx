'use client';

import { Users, Component, BrainCircuit, Swords } from 'lucide-react';
import { motion } from 'framer-motion';

interface Contributor {
  name: string;
  github: string;
  language: string;
  role: string;
}

export default function DashboardStats({ 
  contributors, 
  totalComponents,
  triviaCount = 0,
  rpgCount = 0
}: { 
  contributors: Contributor[], 
  totalComponents: number,
  triviaCount?: number,
  rpgCount?: number
}) {
  
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
      title: "RPG Database Size",
      value: rpgCount,
      icon: Swords,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-100 dark:border-red-900/50"
    },
    {
      title: "Trivia Questions",
      value: triviaCount,
      icon: BrainCircuit,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-100 dark:border-purple-900/50"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8"
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
