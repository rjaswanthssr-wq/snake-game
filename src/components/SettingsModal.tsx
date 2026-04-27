import { X, Settings2, Volume2, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DIFFICULTIES } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  difficulty: string;
  onDifficultyChange: (diff: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  volume,
  onVolumeChange,
  difficulty,
  onDifficultyChange
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm p-6 bg-slate-900/80 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-400">Settings</h3>

              {/* Content */}
              <div className="space-y-6">
                {/* Difficulty */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Difficulty
                  </div>
                  <div className="flex flex-col gap-2">
                    {Object.entries(DIFFICULTIES).map(([key, { label }]) => {
                      const isSelected = difficulty === key;
                      return (
                        <button
                          key={key}
                          onClick={() => onDifficultyChange(key)}
                          className={`py-3 px-4 rounded font-black text-xs uppercase tracking-widest transition-all text-left flex justify-between ${
                            isSelected 
                              ? 'bg-pink-500 text-white' 
                              : 'bg-black/40 text-slate-400 border border-white/5 hover:bg-black/60 hover:text-white'
                          }`}
                        >
                          {label}
                          {isSelected && <span className="text-[10px]">&#10003;</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full"></div>

                {/* Master Volume */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Master Volume</span>
                    <span className="text-white">{Math.round(volume * 100)}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-slate-800 rounded-full flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div 
                      className="h-full bg-white rounded-full pointer-events-none" 
                      style={{ width: `${volume * 100}%` }}
                    ></div>
                    <div 
                      className="absolute w-3 h-3 bg-white border-2 border-slate-900 rounded-full shadow pointer-events-none transform -translate-x-1/2"
                      style={{ left: `${volume * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
