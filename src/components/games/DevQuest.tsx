'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Heart, RefreshCw, Box, Skull, Backpack, Trophy, Star } from 'lucide-react';

export interface Monster {
  id: string;
  name: string;
  description: string;
  hp: number;
  attack: number;
  author: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'heal';
  value: number;
  author: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetMonsterId: string;
  targetCount: number;
  rewardItemId: string;
  author: string;
}

export default function DevQuest({ monsters, items, quests = [] }: { monsters: Monster[], items: Item[], quests?: Quest[] }) {
  // Game State
  const [playerHp, setPlayerHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [level, setLevel] = useState(1);
  const [weapon, setWeapon] = useState<Item>({ 
    id: 'w0', name: 'Fists', description: 'Just your bare hands.', type: 'weapon', value: 5, author: 'System' 
  });
  
  // Inventory & Quests State
  const [inventory, setInventory] = useState<Item[]>([]);
  const [activeQuests, setActiveQuests] = useState<{ [questId: string]: number }>({});
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  // Encounter State
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [monsterHp, setMonsterHp] = useState(0);
  
  // UI State
  const [log, setLog] = useState<string[]>(['Welcome to DevQuest!', 'A new adventure begins...']);
  const [gameState, setGameState] = useState<'exploring' | 'combat' | 'gameover'>('exploring');
  const [damageAnim, setDamageAnim] = useState<{player: number|null, monster: number|null}>({player: null, monster: null});

  // Initialize quests
  useEffect(() => {
    if (quests.length > 0 && Object.keys(activeQuests).length === 0 && completedQuests.length === 0) {
      const initialQuests: { [key: string]: number } = {};
      quests.forEach(q => initialQuests[q.id] = 0);
      setActiveQuests(initialQuests);
    }
  }, [quests]);

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 8));
  };

  const spawnMonster = () => {
    if (monsters.length === 0) return;
    const randomIdx = Math.floor(Math.random() * monsters.length);
    const baseMonster = monsters[randomIdx];
    
    // Scale monster by level
    const scaledMonster = {
      ...baseMonster,
      hp: Math.floor(baseMonster.hp * (1 + level * 0.2)),
      attack: Math.floor(baseMonster.attack * (1 + level * 0.1))
    };
    
    setCurrentMonster(scaledMonster);
    setMonsterHp(scaledMonster.hp);
    setGameState('combat');
    addLog(`A wild ${scaledMonster.name} appeared!`);
  };

  const findItem = () => {
    if (items.length === 0) return;
    const randomIdx = Math.floor(Math.random() * items.length);
    const item = items[randomIdx];
    
    setInventory(prev => [...prev, item]);
    addLog(`You found a chest... Added ${item.name} to your backpack!`);
  };

  const handleExplore = () => {
    // 70% chance monster, 30% chance item
    if (Math.random() > 0.3) {
      spawnMonster();
    } else {
      findItem();
    }
  };

  const checkQuestProgress = (monsterId: string) => {
    const updatedQuests = { ...activeQuests };
    let leveledUpQuest = false;

    quests.forEach(quest => {
      if (quest.targetMonsterId === monsterId && !completedQuests.includes(quest.id) && updatedQuests[quest.id] !== undefined) {
        updatedQuests[quest.id] += 1;
        
        if (updatedQuests[quest.id] >= quest.targetCount) {
          // Quest Complete!
          setCompletedQuests(prev => [...prev, quest.id]);
          addLog(`🏆 Quest Complete: ${quest.title}!`);
          leveledUpQuest = true;
          
          // Grant Reward
          const rewardItem = items.find(i => i.id === quest.rewardItemId);
          if (rewardItem) {
            setInventory(prev => [...prev, rewardItem]);
            addLog(`🎁 You received: ${rewardItem.name}!`);
          }
        }
      }
    });

    if (leveledUpQuest) {
      setActiveQuests(updatedQuests);
    } else {
      setActiveQuests(updatedQuests); // Always update to save progress
    }
  };

  const handleAttack = async () => {
    if (!currentMonster || gameState !== 'combat') return;

    // Player attacks
    const playerDmg = weapon.value + Math.floor(Math.random() * 5);
    const newMonsterHp = Math.max(0, monsterHp - playerDmg);
    setMonsterHp(newMonsterHp);
    setDamageAnim({ player: null, monster: playerDmg });
    addLog(`You hit ${currentMonster.name} for ${playerDmg} damage!`);

    setTimeout(() => setDamageAnim({ player: null, monster: null }), 500);

    if (newMonsterHp === 0) {
      // Monster defeated
      setTimeout(() => {
        addLog(`You defeated ${currentMonster.name}! You leveled up!`);
        setLevel(l => l + 1);
        setMaxHp(h => h + 10);
        setPlayerHp(h => h + 10); // Heal slightly on level up
        
        // Check Quests
        checkQuestProgress(currentMonster.id);

        setGameState('exploring');
        setCurrentMonster(null);
      }, 1000);
      return;
    }

    // Monster attacks back
    setTimeout(() => {
      const monsterDmg = currentMonster.attack + Math.floor(Math.random() * 3);
      const newPlayerHp = Math.max(0, playerHp - monsterDmg);
      setPlayerHp(newPlayerHp);
      setDamageAnim({ player: monsterDmg, monster: null });
      addLog(`${currentMonster.name} hit you for ${monsterDmg} damage!`);

      setTimeout(() => setDamageAnim({ player: null, monster: null }), 500);

      if (newPlayerHp === 0) {
        setGameState('gameover');
        addLog(`You were defeated by ${currentMonster.name}. Game Over.`);
      }
    }, 800);
  };

  const useItem = (item: Item, index: number) => {
    if (item.type === 'weapon') {
      // Swap weapon
      const oldWeapon = weapon;
      setWeapon(item);
      addLog(`Equipped: ${item.name} (Attack: ${item.value})`);
      
      // Put old weapon back in inventory if it's not Fists
      if (oldWeapon.id !== 'w0') {
        const newInv = [...inventory];
        newInv.splice(index, 1, oldWeapon);
        setInventory(newInv);
      } else {
        const newInv = [...inventory];
        newInv.splice(index, 1);
        setInventory(newInv);
      }
    } else if (item.type === 'heal') {
      const healAmt = item.value;
      setPlayerHp(prev => Math.min(maxHp, prev + healAmt));
      addLog(`Used ${item.name}. Healed ${healAmt} HP!`);
      
      const newInv = [...inventory];
      newInv.splice(index, 1);
      setInventory(newInv);
    }
  };

  const resetGame = () => {
    setPlayerHp(100);
    setMaxHp(100);
    setLevel(1);
    setWeapon({ id: 'w0', name: 'Fists', description: '', type: 'weapon', value: 5, author: 'System' });
    setInventory([]);
    setCompletedQuests([]);
    
    const initialQuests: { [key: string]: number } = {};
    quests.forEach(q => initialQuests[q.id] = 0);
    setActiveQuests(initialQuests);

    setGameState('exploring');
    setCurrentMonster(null);
    setLog(['You respawned back at the beginning of the dungeon.']);
  };

  if (!monsters || monsters.length === 0) {
    return <div className="p-8 text-center text-gray-500">No monsters loaded. Add data to data/rpg/monsters.json</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 text-gray-100 rounded-3xl shadow-xl overflow-hidden border border-gray-800 font-mono">
      {/* Header Stats */}
      <div className="bg-gray-950 p-4 sm:p-6 flex flex-wrap justify-between items-center gap-4 border-b border-gray-800">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Player LVL {level}</p>
            <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
              <Heart className="w-5 h-5 fill-green-400" /> 
              {playerHp} / {maxHp} HP
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Equipped Weapon</p>
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Sword className="w-5 h-5" /> 
              {weapon.name} <span className="text-sm font-normal text-gray-400">({weapon.value} DMG)</span>
            </div>
          </div>
        </div>
        
        {gameState === 'gameover' && (
          <button 
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Restart
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Main Game Area */}
        <div className="flex-1 p-6 sm:p-8 min-h-[350px] flex flex-col relative border-r border-gray-800">
          
          {/* Battle Scene */}
          <AnimatePresence mode="wait">
            {gameState === 'exploring' && (
              <motion.div 
                key="exploring"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center space-y-6"
              >
                <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700 text-center">
                  <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">The room is empty.</h3>
                  <p className="text-gray-400 text-sm">Do you want to move to the next room?</p>
                </div>
                
                <button 
                  onClick={handleExplore}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
                >
                  Search Next Room
                </button>
              </motion.div>
            )}

            {gameState === 'combat' && currentMonster && (
              <motion.div 
                key="combat"
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                className="flex-1 flex flex-col items-center justify-center space-y-8 w-full max-w-sm mx-auto"
              >
                <div className="w-full relative">
                  {damageAnim.monster !== null && (
                    <motion.div 
                      initial={{ opacity: 1, y: 0, scale: 1 }} animate={{ opacity: 0, y: -50, scale: 1.5 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 text-2xl font-bold text-red-500 z-10"
                    >
                      -{damageAnim.monster}
                    </motion.div>
                  )}
                  
                  {damageAnim.player !== null && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-red-500/20 rounded-2xl z-0"
                    />
                  )}
                  
                  <div className={`p-6 bg-gray-800 rounded-2xl border border-gray-700 text-center relative z-10 transition-transform ${damageAnim.monster !== null ? 'translate-x-2' : ''}`}>
                    <Skull className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-400 mb-1">{currentMonster.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">"{currentMonster.description}"</p>
                    
                    {/* Monster HP Bar */}
                    <div className="w-full bg-gray-900 rounded-full h-3 mb-1 overflow-hidden">
                      <motion.div 
                        className="bg-red-500 h-3" 
                        initial={{ width: '100%' }}
                        animate={{ width: `${(monsterHp / currentMonster.hp) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right">{monsterHp} / {currentMonster.hp} HP</p>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <button 
                    onClick={handleAttack}
                    disabled={damageAnim.player !== null || damageAnim.monster !== null || monsterHp === 0}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                  >
                    <Sword className="w-5 h-5" /> Attack
                  </button>
                </div>
                <p className="text-xs text-gray-500">Contributed by @{currentMonster.author}</p>
              </motion.div>
            )}

            {gameState === 'gameover' && (
              <motion.div 
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <Skull className="w-24 h-24 text-gray-700 mb-6" />
                <h2 className="text-4xl font-bold text-red-500 mb-2">YOU DIED</h2>
                <p className="text-gray-400 mb-8">You reached Level {level}. The community was too strong.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Combat Log */}
          <div className="mt-8 pt-4 border-t border-gray-800 h-32 overflow-y-auto">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 font-bold">Action Log</p>
            <div className="space-y-1">
              {log.map((entry, idx) => (
                <motion.div 
                  key={`${entry}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-sm ${idx === 0 ? 'text-gray-200' : 'text-gray-500'}`}
                >
                  {idx === 0 ? '> ' : '  '}{entry}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Inventory & Quests */}
        <div className="w-full md:w-80 bg-gray-950 flex flex-col">
          
          {/* Quests Section */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4" /> Active Quests
            </h3>
            <div className="space-y-3">
              {quests.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No quests available.</p>
              ) : quests.map(quest => {
                const isComplete = completedQuests.includes(quest.id);
                const progress = activeQuests[quest.id] || 0;
                
                return (
                  <div key={quest.id} className={`p-3 rounded-lg border ${isComplete ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-gray-900 border-gray-800'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold ${isComplete ? 'text-yellow-500' : 'text-gray-300'}`}>{quest.title}</p>
                      {isComplete && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 leading-tight">{quest.description}</p>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        className={`h-1.5 ${isComplete ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (progress / quest.targetCount) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-right mt-1 text-gray-500">
                      {isComplete ? 'Completed!' : `${progress} / ${quest.targetCount}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backpack Section */}
          <div className="p-4 flex-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Backpack className="w-4 h-4" /> Backpack ({inventory.length})
            </h3>
            
            {inventory.length === 0 ? (
              <div className="text-center py-8">
                <Box className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Your backpack is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {inventory.map((item, idx) => (
                    <motion.div 
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="p-3 bg-gray-900 border border-gray-700 rounded-lg flex justify-between items-center group hover:border-gray-500 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-200">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type === 'weapon' ? `Attack: ${item.value}` : `Heal: ${item.value} HP`}</p>
                      </div>
                      <button 
                        onClick={() => useItem(item, idx)}
                        disabled={gameState === 'gameover'}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                          item.type === 'weapon' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                      >
                        {item.type === 'weapon' ? 'Equip' : 'Drink'}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
