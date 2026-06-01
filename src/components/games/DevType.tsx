'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, RefreshCw, Keyboard, Activity } from 'lucide-react';

export interface Snippet {
  id: string;
  language: string;
  code: string;
  author: string;
}

interface DevTypeProps {
  snippets: Snippet[];
}

export default function DevType({ snippets }: DevTypeProps) {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'typing' | 'finished'>('idle');

  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<Set<number>>(new Set());

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when game starts
  useEffect(() => {
    if (gameState === 'typing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Tick time every second for live WPM, without depending on input
  useEffect(() => {
    if (gameState === 'typing' && startTime) {
      const interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, startTime]);

  const startGame = (snippet: Snippet) => {
    // Normalize code: replace tabs with 2 spaces, standard \n
    const cleanCode = snippet.code.replace(/\t/g, '  ');
    setSelectedSnippet({ ...snippet, code: cleanCode });
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setNow(null);
    setMistakes(new Set());
    setGameState('typing');
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState !== 'typing' || !selectedSnippet) return;

    let val = e.target.value;

    // Start timer on first keystroke
    if (!startTime && val.length > 0) {
      const t = Date.now();
      setStartTime(t);
      setNow(t);
    }

    // Prevent pasting
    if (val.length > input.length + 1) {
      return;
    }

    // Prevent typing past the end of the snippet
    if (val.length > selectedSnippet.code.length) {
      return;
    }

    // Auto-indent: if user typed correct \n, auto-fill the following spaces
    if (val.length > input.length && val.endsWith('\n')) {
      const charIndex = val.length - 1;
      if (selectedSnippet.code[charIndex] === '\n') {
        let spaces = '';
        let i = charIndex + 1;
        while (i < selectedSnippet.code.length && selectedSnippet.code[i] === ' ') {
          spaces += ' ';
          i++;
        }
        val += spaces;
      }
    }

    // Track strict mistakes (permanently docks accuracy for this index)
    if (e.target.value.length > input.length) {
      const charIndex = e.target.value.length - 1;
      if (e.target.value[charIndex] !== selectedSnippet.code[charIndex]) {
        setMistakes(prev => new Set(prev).add(charIndex));
      }
    }

    setInput(val);

    // Check if finished (Must be exactly correct)
    if (val === selectedSnippet.code) {
      finishGame(val, selectedSnippet.code);
    }
  };

  const finishGame = (finalInput: string, targetCode: string) => {
    const end = Date.now();
    setEndTime(end);
    setNow(end);
    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('idle');
    setSelectedSnippet(null);
  };

  // Helper to calculate WPM dynamically
  const getWPM = () => {
    if (!startTime) return 0;
    const end = gameState === 'finished' ? (endTime || startTime) : (now || startTime);
    const timeElapsed = Math.max(0.001, (end - startTime) / 60000); // avoid div by 0

    const lengthToCompare = gameState === 'finished' ? selectedSnippet!.code.length : input.length;
    let mistakesInScope = 0;
    mistakes.forEach(index => {
      if (index < lengthToCompare) mistakesInScope++;
    });

    const correctChars = Math.max(0, lengthToCompare - mistakesInScope);
    const words = correctChars / 5;

    return Math.round(words / timeElapsed);
  };

  // Helper to calculate accuracy dynamically
  const getAccuracy = () => {
    if (!selectedSnippet) return 0;
    const lengthToCompare = gameState === 'typing' ? Math.max(1, input.length) : selectedSnippet.code.length;
    // Count mistakes that occurred within the currently typed length (or total length if finished)
    let mistakesInScope = 0;
    mistakes.forEach(index => {
      if (index < lengthToCompare) mistakesInScope++;
    });
    return Math.max(0, Math.round(((lengthToCompare - mistakesInScope) / lengthToCompare) * 100));
  };

  const renderCharacter = (char: string, index: number, target: string) => {
    let color = 'text-gray-500'; // Upcoming
    let bg = '';

    if (index < input.length) {
      if (input[index] === char) {
        color = 'text-green-400'; // Correct
      } else {
        color = 'text-red-400'; // Incorrect
        bg = 'bg-red-500/20'; // Highlight mistake
      }
    }

    // Cursor
    const isCursor = index === input.length && gameState === 'typing';
    const cursorClass = isCursor ? 'bg-gray-200 text-gray-900 rounded-sm animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]' : '';

    // Visualize newlines so they can be typed
    if (char === '\n') {
      return (
        <React.Fragment key={index}>
          <span className={`${color} ${bg} ${cursorClass}`}>
            ↵
          </span>
          <br />
        </React.Fragment>
      );
    }

    return (
      <span
        key={index}
        className={`${color} ${bg} ${cursorClass} ${char === ' ' && index < input.length && input[index] !== ' ' ? 'bg-red-500/20' : ''}`}
      >
        {char}
      </span>
    );
  };

  if (!snippets || snippets.length === 0) {
    return <div className="text-center p-8 text-gray-500">Need snippets in data/snippets.json</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden font-mono text-gray-200">

      {/* Header */}
      <div className="bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
          <Terminal className="w-6 h-6" /> DevType
        </h2>
        {gameState !== 'idle' && (
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Quit
          </button>
        )}
      </div>

      {gameState === 'idle' && (
        <div className="p-8 space-y-8">
          <p className="text-center text-gray-400 max-w-lg mx-auto">
            Test your typing speed against real code snippets submitted by the community.
            Accuracy and WPM are measured in real-time.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {snippets.map(snippet => (
              <motion.div
                key={snippet.id}
                whileHover={{ y: -5 }}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-emerald-500/50 cursor-pointer transition-colors"
                onClick={() => startGame(snippet)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-gray-900 text-xs font-bold rounded-md text-emerald-400">
                    {snippet.language}
                  </span>
                  <span className="text-xs text-gray-500">@{snippet.author}</span>
                </div>
                <div className="text-sm text-gray-400 line-clamp-3 mb-4 opacity-70">
                  {snippet.code}
                </div>
                <button className="w-full py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors font-bold text-sm flex items-center justify-center gap-2">
                  <Keyboard className="w-4 h-4" /> Type This
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(gameState === 'typing' || gameState === 'finished') && selectedSnippet && (
        <div className="p-8">

          {/* Top Bar Metrics */}
          <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
            <div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Snippet</div>
              <div className="text-xl font-bold text-gray-200">{selectedSnippet.language}</div>
            </div>
            <div className="flex gap-8">
              <div className="text-right">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">WPM</div>
                <div className={`text-3xl font-black ${gameState === 'finished' ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {getWPM()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Accuracy</div>
                <div className={`text-3xl font-black ${gameState === 'finished' ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {getAccuracy()}%
                </div>
              </div>
            </div>
          </div>

          {/* Typing Area */}
          <div
            className="relative bg-gray-950 p-8 rounded-2xl border border-gray-800 font-mono text-xl leading-relaxed whitespace-pre overflow-x-auto cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Hidden Input Overlay */}
            <textarea
              ref={inputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none z-10"
              value={input}
              onChange={handleInput}
              disabled={gameState === 'finished'}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {/* Rendered Text */}
            <div className="pointer-events-none select-none">
              {selectedSnippet.code.split('').map((char, index) => renderCharacter(char, index, selectedSnippet.code))}
            </div>
          </div>

          {/* Results Overlay */}
          <AnimatePresence>
            {gameState === 'finished' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-emerald-900/20 border border-emerald-500/50 rounded-2xl flex justify-between items-center"
              >
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">Test Complete!</h3>
                  <p className="text-gray-400">You typed {selectedSnippet.code.length} characters in {((endTime! - startTime!) / 1000).toFixed(1)} seconds.</p>
                </div>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
}
