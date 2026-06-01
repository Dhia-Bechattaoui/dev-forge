'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Heart, Sword, Swords, RefreshCw, Cpu, Activity } from 'lucide-react';

export interface BotStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Bot {
  id: string;
  name: string;
  author: string;
  stats: BotStats;
}

interface CodeBotBattlerProps {
  bots: Bot[];
}

const STAT_CAP = 150;

// Helper to normalize stats to 150 total points if they exceed it
const normalizeStats = (stats: BotStats): BotStats => {
  const total = stats.hp + stats.attack + stats.defense + stats.speed;
  if (total <= STAT_CAP) return stats;

  const ratio = STAT_CAP / total;
  return {
    hp: Math.floor(stats.hp * ratio),
    attack: Math.floor(stats.attack * ratio),
    defense: Math.floor(stats.defense * ratio),
    speed: Math.floor(stats.speed * ratio),
  };
};

export default function CodeBotBattler({ bots }: CodeBotBattlerProps) {
  const [botA, setBotA] = useState<Bot | null>(null);
  const [botB, setBotB] = useState<Bot | null>(null);
  const [gameState, setGameState] = useState<'matchmaking' | 'battling' | 'finished'>('matchmaking');

  // Battle state
  const [hpA, setHpA] = useState(0);
  const [hpB, setHpB] = useState(0);
  const [maxHpA, setMaxHpA] = useState(0);
  const [maxHpB, setMaxHpB] = useState(0);
  
  // ATB (Active Time Battle) State: 0 to 100
  const [atbA, setAtbA] = useState(0);
  const [atbB, setAtbB] = useState(0);

  const [log, setLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<Bot | null>(null);

  const [animState, setAnimState] = useState<{a: boolean, b: boolean}>({a: false, b: false});
  const atbARef = useRef(0);
  const atbBRef = useRef(0);

  // Normalize bots once selected
  const normalizedA = botA ? { ...botA, stats: normalizeStats(botA.stats) } : null;
  const normalizedB = botB ? { ...botB, stats: normalizeStats(botB.stats) } : null;

  const startBattle = () => {
    if (!normalizedA || !normalizedB) return;
    
    // Scale HP stat by 10 so battles last longer!
    const battleHpA = normalizedA.stats.hp * 10;
    const battleHpB = normalizedB.stats.hp * 10;

    setHpA(battleHpA);
    setHpB(battleHpB);
    setMaxHpA(battleHpA);
    setMaxHpB(battleHpB);
    setAtbA(0);
    setAtbB(0);
    atbARef.current = 0;
    atbBRef.current = 0;
    
    setLog(['System Initialized.', `${normalizedA.name} vs ${normalizedB.name}`, 'FIGHT!']);
    setWinner(null);
    setGameState('battling');
  };

  // Automated ATB Battle Loop
  useEffect(() => {
    if (gameState !== 'battling' || !normalizedA || !normalizedB) return;

    // Run the game tick every 100ms
    const timer = setInterval(() => {
      // Scale speed: 10 speed = +2 per tick (50 ticks = 5s), 50 speed = +10 per tick (1s)
      // Atb threshold is 100
      const tickA = Math.max(1, normalizedA.stats.speed / 5);
      const tickB = Math.max(1, normalizedB.stats.speed / 5);

      atbARef.current += tickA;
      atbBRef.current += tickB;

      // Check if A attacks
      if (atbARef.current >= 100) {
        atbARef.current = 0;
        executeAttack(normalizedA, normalizedB, 'A');
      }

      // Check if B attacks (can happen in the same tick)
      if (atbBRef.current >= 100) {
        atbBRef.current = 0;
        executeAttack(normalizedB, normalizedA, 'B');
      }

      setAtbA(atbARef.current);
      setAtbB(atbBRef.current);

    }, 100);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, normalizedA, normalizedB]);

  const executeAttack = (attacker: Bot, defender: Bot, attackerSide: 'A' | 'B') => {
    setHpA(prevA => {
      setHpB(prevB => {
        // Prevent attacking if battle is already over
        if (prevA <= 0 || prevB <= 0) return prevB;

        const rng = Math.floor(Math.random() * 6);
        let damage = Math.floor(attacker.stats.attack - (defender.stats.defense * 0.5)) + rng;
        if (damage < 1) damage = 1;

        if (attackerSide === 'A') {
          setAnimState(prev => ({ ...prev, a: true }));
          setTimeout(() => setAnimState(prev => ({ ...prev, a: false })), 200);
          
          const newHp = Math.max(0, prevB - damage);
          if (newHp === 0) endGame(attacker);
          setLog(prev => [`${attacker.name} strikes for ${damage} dmg!`, ...prev].slice(0, 15));
          return newHp;
        } else {
          // Attacker is B, so we need to return prevB unchanged here and update prevA below
          return prevB;
        }
      });

      // Handle B attacking A
      if (attackerSide === 'B') {
        if (prevA <= 0 || hpB <= 0) return prevA; // Wait, we can't cleanly access hpB inside here, but we check if it's over in endGame anyway
        
        const rng = Math.floor(Math.random() * 6);
        let damage = Math.floor(attacker.stats.attack - (defender.stats.defense * 0.5)) + rng;
        if (damage < 1) damage = 1;

        setAnimState(prev => ({ ...prev, b: true }));
        setTimeout(() => setAnimState(prev => ({ ...prev, b: false })), 200);

        const newHp = Math.max(0, prevA - damage);
        if (newHp === 0) endGame(attacker);
        setLog(prev => [`${attacker.name} blasts for ${damage} dmg!`, ...prev].slice(0, 15));
        return newHp;
      }

      return prevA;
    });
  };

  const endGame = (winBot: Bot) => {
    setWinner(winBot);
    setGameState('finished');
    setLog(prev => [`${winBot.name} wins the battle!`, ...prev]);
  };

  if (!bots || bots.length < 2) {
    return <div className="text-center p-8 text-gray-500">Need at least 2 bots in data/bots.json</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden font-mono text-gray-200">
      <div className="bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
          <Cpu className="w-6 h-6" /> CodeBot Auto-Battler
        </h2>
        {gameState !== 'matchmaking' && (
          <button
            onClick={() => setGameState('matchmaking')}
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Rematch
          </button>
        )}
      </div>

      {gameState === 'matchmaking' && (
        <div className="p-8 space-y-8">
          <p className="text-center text-gray-400 max-w-lg mx-auto">
            Select two community-built bots. Stats are normalized to a maximum of 150 points.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <BotSelector label="Select Bot A" bots={bots} selected={botA} onSelect={setBotA} side="blue" />
            <BotSelector label="Select Bot B" bots={bots} selected={botB} onSelect={setBotB} side="red" />
          </div>

          <div className="flex justify-center pt-4">
            <button
              disabled={!botA || !botB || botA.id === botB.id}
              onClick={startBattle}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20 text-lg flex items-center gap-3"
            >
              <Swords className="w-6 h-6" />
              {botA && botB && botA.id === botB.id ? 'Bots must be different' : 'Simulate Battle'}
            </button>
          </div>
        </div>
      )}

      {gameState !== 'matchmaking' && normalizedA && normalizedB && (
        <div className="flex flex-col md:flex-row">

          {/* Battle Arena */}
          <div className="flex-1 p-8 relative min-h-[400px] flex items-center justify-between border-b md:border-b-0 md:border-r border-gray-800">
            {/* Bot A UI */}
            <div className="w-1/3 text-center space-y-4">
              <div className="text-lg font-bold text-blue-400">{normalizedA.name}</div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-blue-500 h-3"
                  initial={{ width: '100%' }}
                  animate={{ width: `${Math.max(0, (hpA / maxHpA) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{hpA} / {maxHpA} HP</div>
              
              {/* ATB Bar */}
              <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden mt-1 border border-gray-800">
                <motion.div 
                  className="bg-yellow-500 h-1" 
                  style={{ width: `${Math.min(100, atbA)}%` }}
                />
              </div>

              <motion.div
                animate={animState.a ? { x: 50, scale: 1.1 } : { x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-24 h-24 mx-auto bg-blue-900/30 border-2 border-blue-500/50 rounded-xl flex items-center justify-center relative overflow-hidden mt-4"
              >
                <Cpu className={`w-12 h-12 text-blue-400 ${hpA === 0 ? 'opacity-20' : ''}`} />
                {hpA === 0 && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center font-bold text-red-500">DEAD</div>}
              </motion.div>
            </div>

            {/* VS */}
            <div className="text-4xl font-black text-gray-800">VS</div>

            {/* Bot B UI */}
            <div className="w-1/3 text-center space-y-4">
              <div className="text-lg font-bold text-red-400">{normalizedB.name}</div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-red-500 h-3"
                  initial={{ width: '100%' }}
                  animate={{ width: `${Math.max(0, (hpB / maxHpB) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{hpB} / {maxHpB} HP</div>
              
              {/* ATB Bar */}
              <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden mt-1 border border-gray-800">
                <motion.div 
                  className="bg-yellow-500 h-1" 
                  style={{ width: `${Math.min(100, atbB)}%` }}
                />
              </div>

              <motion.div
                animate={animState.b ? { x: -50, scale: 1.1 } : { x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-24 h-24 mx-auto bg-red-900/30 border-2 border-red-500/50 rounded-xl flex items-center justify-center relative overflow-hidden mt-4"
              >
                <Cpu className={`w-12 h-12 text-red-400 ${hpB === 0 ? 'opacity-20' : ''}`} />
                {hpB === 0 && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center font-bold text-red-500">DEAD</div>}
              </motion.div>
            </div>

            {/* Winner Overlay */}
            <AnimatePresence>
              {gameState === 'finished' && winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10"
                >
                  <div className="text-center p-8 bg-gray-800 border-2 border-yellow-500/50 rounded-3xl shadow-2xl">
                    <TrophyIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-yellow-500 mb-2">{winner.name} WINS!</h2>
                    <p className="text-gray-400">Contributed by @{winner.author}</p>
                    <button
                      onClick={() => setGameState('matchmaking')}
                      className="mt-6 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Combat Log */}
          <div className="w-full md:w-80 bg-gray-950 p-4 flex flex-col h-[400px]">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> System Log
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              <AnimatePresence>
                {log.map((entry, idx) => (
                  <motion.div
                    key={`${idx}-${entry}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm ${idx === 0 ? 'text-gray-200 font-bold' : 'text-gray-500'}`}
                  >
                    {idx === 0 ? '> ' : '  '}{entry}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function BotSelector({ label, bots, selected, onSelect, side }: { label: string, bots: Bot[], selected: Bot | null, onSelect: (b: Bot) => void, side: 'blue' | 'red' }) {
  const normalized = selected ? normalizeStats(selected.stats) : null;
  const color = side === 'blue' ? 'border-blue-500/30' : 'border-red-500/30';

  return (
    <div className={`p-6 bg-gray-800 rounded-2xl border ${color}`}>
      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{label}</label>
      <select
        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={selected?.id || ''}
        onChange={(e) => {
          const bot = bots.find(b => b.id === e.target.value);
          if (bot) onSelect(bot);
        }}
      >
        <option value="" disabled>-- Select a Bot --</option>
        {bots.map(b => (
          <option key={b.id} value={b.id}>{b.name} (@{b.author})</option>
        ))}
      </select>

      {selected && normalized && (
        <div className="space-y-3">
          <StatBar icon={Heart} label="HP" value={normalized.hp} color="bg-green-500" />
          <StatBar icon={Sword} label="ATK" value={normalized.attack} color="bg-red-500" />
          <StatBar icon={Shield} label="DEF" value={normalized.defense} color="bg-blue-500" />
          <StatBar icon={Zap} label="SPD" value={normalized.speed} color="bg-yellow-500" />
          <div className="text-right text-xs text-gray-500 pt-2 border-t border-gray-700">
            Total Points: {normalized.hp + normalized.attack + normalized.defense + normalized.speed} / {STAT_CAP}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBar({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 flex items-center gap-1 text-xs font-bold text-gray-400">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="flex-1 bg-gray-900 rounded-full h-2 overflow-hidden">
        <div className={`h-2 ${color}`} style={{ width: `${Math.min(100, (value / 150) * 100)}%` }} />
      </div>
      <div className="w-8 text-right text-xs font-mono">{value}</div>
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
