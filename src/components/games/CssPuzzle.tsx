'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, CheckCircle, ArrowRight, RefreshCw, Code2, Play } from 'lucide-react';

export interface CssPuzzleLevel {
  id: string;
  title: string;
  author: string;
  description: string;
  initialCss: string;
  htmlStructure: string;
  requiredStyles: Record<string, string>;
}

interface CssPuzzleProps {
  puzzles: CssPuzzleLevel[];
}

export default function CssPuzzle({ puzzles }: CssPuzzleProps) {
  const [selectedLevel, setSelectedLevel] = useState<CssPuzzleLevel | null>(null);
  const [cssInput, setCssInput] = useState('');
  const [isSolved, setIsSolved] = useState(false);

  // Parse CSS string to React style object
  const getReactStyles = (cssStr: string) => {
    const styleObj: any = {};
    const rules = cssStr.split(';');
    rules.forEach(rule => {
      const parts = rule.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const val = parts[1].trim();
        if (key && val) {
          const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
          styleObj[camelKey] = val;
        }
      }
    });
    return styleObj;
  };

  // Validate the CSS
  const checkWin = (cssStr: string, required: Record<string, string>) => {
    const parsed = new Map<string, string>();
    const rules = cssStr.split(';');
    rules.forEach(rule => {
      const parts = rule.split(':');
      if (parts.length === 2) {
        parsed.set(parts[0].trim().toLowerCase(), parts[1].trim().toLowerCase());
      }
    });

    for (const [key, expectedVal] of Object.entries(required)) {
      if (parsed.get(key.toLowerCase()) !== expectedVal.toLowerCase()) {
        return false;
      }
    }
    return true;
  };

  const handleCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCssInput(val);
    if (selectedLevel) {
      if (checkWin(val, selectedLevel.requiredStyles)) {
        setIsSolved(true);
      } else {
        setIsSolved(false);
      }
    }
  };

  const startLevel = (level: CssPuzzleLevel) => {
    setSelectedLevel(level);
    setCssInput(level.initialCss);
    setIsSolved(false);
  };

  const resetGame = () => {
    setSelectedLevel(null);
    setCssInput('');
    setIsSolved(false);
  };

  if (!puzzles || puzzles.length === 0) {
    return <div className="text-center p-8 text-gray-500">Need puzzles in data/css-puzzles.json</div>;
  }

  // Box renderer based on htmlStructure string
  const renderBoxes = () => {
    if (!selectedLevel) return null;
    const boxCount = (selectedLevel.htmlStructure.match(/<div/g) || []).length || 1;
    const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];

    return Array.from({ length: boxCount }).map((_, i) => (
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        key={i}
        className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white/20 z-10 ${colors[i % colors.length]}`}
      >
        {i + 1}
      </motion.div>
    ));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-gray-200">

      {/* Header */}
      <div className="bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
          <Layout className="w-6 h-6" /> CSS Puzzle Game
        </h2>
        {selectedLevel && (
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Menu
          </button>
        )}
      </div>

      {/* Menu State */}
      {!selectedLevel && (
        <div className="p-8 space-y-8">
          <p className="text-center text-gray-400 max-w-lg mx-auto">
            Test your layout skills! Write actual CSS to position elements correctly on the screen and solve the puzzle.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {puzzles.map((puzzle, idx) => (
              <motion.div
                key={puzzle.id}
                whileHover={{ y: -5 }}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-indigo-500/50 cursor-pointer transition-colors flex flex-col"
                onClick={() => startLevel(puzzle)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-gray-900 text-xs font-bold rounded-md text-indigo-400">
                    Level {idx + 1}
                  </span>
                  <span className="text-xs text-gray-500">@{puzzle.author}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{puzzle.title}</h3>
                <p className="text-sm text-gray-400 mb-6 flex-grow">{puzzle.description}</p>
                <button className="w-full py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors font-bold text-sm flex items-center justify-center gap-2 mt-auto">
                  <Play className="w-4 h-4" /> Play Level
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Playing State */}
      {selectedLevel && (
        <div className="grid md:grid-cols-2 h-[500px]">

          {/* Editor Left Side */}
          <div className="bg-gray-950 p-6 flex flex-col border-r border-gray-800">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-indigo-400 mb-2">{selectedLevel.title}</h3>
              <p className="text-sm text-gray-400">{selectedLevel.description}</p>
            </div>

            <div className="flex-grow flex flex-col bg-gray-900 rounded-xl overflow-hidden border border-gray-800 font-mono text-sm">
              {/* Filename bar */}
              <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex items-center gap-2 border-b border-gray-700">
                <Code2 className="w-4 h-4" /> style.css
              </div>

              {/* #container { row */}
              <div className="px-4 pt-3 text-gray-500 select-none whitespace-pre">#container {'{'}</div>

              {/* Editable CSS area — indented inside the braces */}
              <textarea
                value={cssInput}
                onChange={handleCssChange}
                spellCheck={false}
                className="flex-grow w-full bg-transparent text-gray-200 focus:outline-none resize-none px-4 pl-8 py-1 leading-relaxed"
                placeholder="  write your CSS here..."
              />

              {/* } closing brace row */}
              <div className="px-4 pb-3 text-gray-500 select-none">{'}'}</div>
            </div>

            {/* Success State overlay on editor */}
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3 text-emerald-400 font-bold">
                  <CheckCircle className="w-6 h-6" /> Puzzle Solved!
                </div>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Visual Preview Right Side */}
          <div className="p-8 flex flex-col">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex justify-between items-center">
              <span>Preview</span>
              {isSolved && <span className="text-emerald-400 animate-pulse">Match Perfect!</span>}
            </div>

            {/* The Target Container */}
            <div className="flex-grow w-full border-2 border-dashed border-gray-700 rounded-2xl relative overflow-hidden bg-gray-900/50">
              {/* Fake grid background to look like a canvas */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* The actual dynamic container */}
              <div
                id="container"
                className="absolute inset-0 p-4 transition-all duration-300"
                style={getReactStyles(cssInput)}
              >
                {renderBoxes()}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
