'use client';

import { useEffect, useState } from 'react';
import { GitBranch, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GithubStatsCard() {
  const [stats, setStats] = useState({ followers: 0, repos: 0, login: '' });
  const [loading, setLoading] = useState(true);
  
  // You can change this to any GitHub username!
  const username = 'Dhia-Bechattaoui'; 

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          followers: data.followers || 0,
          repos: data.public_repos || 0,
          login: data.login || username,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 h-48 bg-gray-100 rounded-2xl animate-pulse" />;
  }

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl border border-gray-800 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700">
          <GitBranch className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg tracking-tight">GitHub Stats</h3>
          <p className="text-gray-400 text-sm">@{stats.login}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-gray-800/40 p-4 rounded-xl flex items-center gap-3 border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
          <Users className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-2xl font-bold">{stats.followers}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Followers</p>
          </div>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-xl flex items-center gap-3 border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-2xl font-bold">{stats.repos}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Repositories</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
