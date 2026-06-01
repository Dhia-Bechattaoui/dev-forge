'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ARRAY_SIZE = 25;
const MIN_VAL = 10;
const MAX_VAL = 100;

export default function AlgorithmVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speedMs, setSpeedMs] = useState(50);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  
  // Ref to track if we should stop sorting
  const isSortingRef = useRef(false);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    if (isSorting) return;
    const newArray = Array.from({ length: ARRAY_SIZE }, () => 
      Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1) + MIN_VAL)
    );
    setArray(newArray);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isSortingRef.current = true;

    let arr = [...array];
    let n = arr.length;
    let newSortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) {
          setIsSorting(false);
          return; // Stop if paused or reset
        }

        setActiveIndices([j, j + 1]);
        await sleep(speedMs);

        if (arr[j] > arr[j + 1]) {
          // Swap
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          // Wait a tiny bit more for visual impact of swap
          await sleep(speedMs);
        }
      }
      newSortedIndices.push(n - i - 1);
      setSortedIndices([...newSortedIndices]);
    }
    
    // Push the very first element as sorted
    newSortedIndices.push(0);
    setSortedIndices([...newSortedIndices]);
    
    setActiveIndices([]);
    setIsSorting(false);
    isSortingRef.current = false;
  };

  const stopSorting = () => {
    isSortingRef.current = false;
    setIsSorting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bubble Sort</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Time Complexity: O(n²)</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={generateArray}
            disabled={isSorting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Shuffle className="w-4 h-4" /> New Array
          </button>
          
          {isSorting ? (
            <button
              onClick={stopSorting}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium transition-colors"
            >
              <Pause className="w-4 h-4" /> Stop
            </button>
          ) : (
            <button
              onClick={bubbleSort}
              disabled={sortedIndices.length === ARRAY_SIZE}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> Start Sort
            </button>
          )}
        </div>
      </div>

      {/* Speed Control */}
      <div className="mb-8 flex items-center justify-between max-w-sm">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Animation Speed
        </label>
        <input 
          type="range" 
          min="10" 
          max="200" 
          value={210 - speedMs} // Invert slider logic so right is faster
          onChange={(e) => setSpeedMs(210 - Number(e.target.value))}
          className="w-1/2 accent-purple-600"
          disabled={isSorting}
        />
      </div>

      {/* Visualizer Area */}
      <div className="h-64 sm:h-80 w-full flex items-end justify-center gap-1 sm:gap-2 bg-gray-50 dark:bg-gray-950 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
        {array.map((value, idx) => {
          // Calculate height percentage based on MAX_VAL
          const heightPct = `${(value / MAX_VAL) * 100}%`;
          
          let bgColor = 'bg-blue-400 dark:bg-blue-600';
          if (activeIndices.includes(idx)) {
            bgColor = 'bg-red-400 dark:bg-red-500';
          } else if (sortedIndices.includes(idx)) {
            bgColor = 'bg-green-400 dark:bg-green-500';
          }

          return (
            <motion.div
              layout
              key={idx} // Using index is safe here because we re-render the whole array mapping correctly
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`w-full max-w-[24px] ${bgColor} rounded-t-md transition-colors duration-150 relative group`}
              style={{ height: heightPct }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {value}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
