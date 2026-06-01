'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Terminal, Search, ArrowRight, GitBranch, RotateCcw } from 'lucide-react';

interface GitCommand {
  command: string;
  description: string;
  stageTransition?: [WorkflowStage, WorkflowStage];
}

type WorkflowStage = 'Working Directory' | 'Staging Area' | 'Local Repo' | 'Remote Repo';

const commandsData: Record<string, GitCommand[]> = {
  Basics: [
    { command: 'git init', description: 'Initialize a new Git repository' },
    { command: 'git clone <url>', description: 'Clone a remote repository to your local machine' },
    { command: 'git status', description: 'Show the working tree status' },
    { command: 'git add .', description: 'Add all current changes to the staging area', stageTransition: ['Working Directory', 'Staging Area'] },
    { command: 'git commit -m "msg"', description: 'Record changes to the repository', stageTransition: ['Staging Area', 'Local Repo'] },
  ],
  Branching: [
    { command: 'git branch', description: 'List all local branches' },
    { command: 'git checkout -b <branch>', description: 'Create and switch to a new branch' },
    { command: 'git merge <branch>', description: 'Merge a branch into the current branch' },
    { command: 'git checkout <branch>', description: 'Switch to a different branch' },
  ],
  Syncing: [
    { command: 'git fetch', description: 'Download objects and refs from another repository' },
    { command: 'git pull', description: 'Fetch from and integrate with another repository or a local branch', stageTransition: ['Remote Repo', 'Local Repo'] },
    { command: 'git push origin main', description: 'Update remote refs along with associated objects', stageTransition: ['Local Repo', 'Remote Repo'] },
    { command: 'git remote -v', description: 'Show a list of existing remotes' },
  ],
  Undoing: [
    { command: 'git restore <file>', description: 'Restore working tree files', stageTransition: ['Staging Area', 'Working Directory'] },
    { command: 'git reset HEAD <file>', description: 'Remove file from staging area' },
    { command: 'git revert <commit>', description: 'Revert some existing commits' },
    { command: 'git reset --hard', description: 'Reset current HEAD to the specified state' },
  ]
};

const workflowStages: WorkflowStage[] = ['Working Directory', 'Staging Area', 'Local Repo', 'Remote Repo'];

export default function GitCheatSheet() {
  const [activeTab, setActiveTab] = useState<string>('Basics');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopy = async (command: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(command);
        setCopiedCommand(command);
        setTimeout(() => setCopiedCommand(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const filteredCommands = commandsData[activeTab].filter(cmd =>
    cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex items-start sm:items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shrink-0">
          <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">Git & GitHub Cheat Sheet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Interactive guide and reference for common commands.</p>
        </div>
      </div>

      {/* Interactive Workflow Diagram */}
      <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> Git Data Flow
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 relative">
          {workflowStages.map((stage, idx) => (
            <div key={stage} className="flex items-center gap-2 my-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-xs font-medium text-gray-800 dark:text-gray-200 z-10 relative text-center"
              >
                {stage}
              </motion.div>
              {idx < workflowStages.length - 1 && (
                <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar w-full">
          {Object.keys(commandsData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {tab === 'Basics' && <Terminal className="w-4 h-4 inline-block mr-2" />}
              {tab === 'Branching' && <GitBranch className="w-4 h-4 inline-block mr-2" />}
              {tab === 'Syncing' && <ArrowRight className="w-4 h-4 inline-block mr-2" />}
              {tab === 'Undoing' && <RotateCcw className="w-4 h-4 inline-block mr-2" />}
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
          />
        </div>
      </div>

      {/* Command List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <motion.div
                key={cmd.command}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -2 }}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition-all gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <code className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded whitespace-nowrap">
                      {cmd.command}
                    </code>
                    {cmd.stageTransition && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 hidden md:inline-block">
                        {cmd.stageTransition[0]} → {cmd.stageTransition[1]}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cmd.description}</p>
                </div>

                <button
                  onClick={() => handleCopy(cmd.command)}
                  className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors shrink-0"
                  aria-label="Copy command"
                >
                  {copiedCommand === cmd.command ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-gray-500 dark:text-gray-400"
            >
              No commands found matching "{searchQuery}"
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
