'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface TriviaQuestion {
  question: string;
  options: string[];
  answer: string;
  author: string;
}

export default function TriviaGame({ questions }: { questions: TriviaQuestion[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
        No trivia questions available! Add some to <code>data/trivia.json</code>.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">DevForge Trivia</h2>
        </div>
        <div className="bg-black/20 px-4 py-1.5 rounded-full font-mono text-sm font-semibold backdrop-blur-sm">
          Score: {score}
        </div>
      </div>

      <div className="p-6 sm:p-8 min-h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {showResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <div className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-2">
                <Trophy className={`w-12 h-12 ${score === questions.length ? 'text-yellow-500 animate-bounce' : 'text-yellow-600 dark:text-yellow-400'}`} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {score === questions.length ? 'Perfect Score! 🎉' :
                  score >= questions.length / 2 ? 'Great Job!' : 'Game Over!'}
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                You scored <strong className="text-blue-600 dark:text-blue-400">{score}</strong> out of {questions.length}
              </p>

              <button
                onClick={restartGame}
                className="mt-4 inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.answer;

                  let buttonClass = "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200";

                  if (isAnswered) {
                    if (isCorrect) {
                      buttonClass = "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-200";
                    } else if (isSelected) {
                      buttonClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-200";
                    } else {
                      buttonClass = "opacity-50 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ${buttonClass} ${!isAnswered && 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {isAnswered && isCorrect && <Check className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Contributed by <strong>@{currentQuestion.author}</strong></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Temporary Check icon since we didn't import it at the top
function Check(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
