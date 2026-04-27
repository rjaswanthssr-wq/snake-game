import { useState, useRef, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { SettingsModal } from './components/SettingsModal';
import { TRACKS, DIFFICULTIES } from './constants';
import { Settings } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.error("Audio playback failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle Skip Next
  const handleSkipNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  // Handle Skip Prev
  const handleSkipPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  // Handle Volume Change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  // Keep Audio element in sync with the track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[currentTrackIndex].url;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Audio playback error:", err));
      }
    }
  }, [currentTrackIndex]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={handleSkipNext}
      />

      {/* Header */}
      <header className="flex justify-between items-start p-6 md:p-10 shrink-0">
        <div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
            Neon<br/><span className="text-cyan-400">Snake</span>
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.3em] font-mono mt-2 text-slate-500">
            BETA VERSION 2.0.4 // AUDIO VISUALIZER ACTIVE
          </p>
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5 opacity-50 hover:opacity-100" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row gap-8 px-6 md:px-10 items-center justify-center relative">
        <SnakeGame speed={DIFFICULTIES[difficulty].speed} difficulty={difficulty} />
        
        {/* Right side Visualizer text effect */}
        <section className="hidden xl:flex h-full flex-col justify-center items-end absolute right-10 top-0 bottom-0 pointer-events-none">
          <div className="writing-vertical-rl rotate-180 flex items-center gap-4">
            <p className="text-[100px] md:text-[150px] font-black text-white/[0.03] leading-none select-none uppercase tracking-tighter">Visualizer</p>
          </div>
        </section>
      </main>
      
      {/* Footer / Music Player */}
      <footer className="w-full shrink-0">
        <MusicPlayer 
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          volume={volume}
          onPlayPause={togglePlayPause}
          onSkipNext={handleSkipNext}
          onSkipPrev={handleSkipPrev}
          onVolumeChange={handleVolumeChange}
        />
      </footer>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        difficulty={difficulty}
        onDifficultyChange={(d) => setDifficulty(d as 'easy' | 'medium' | 'hard')}
      />
    </div>
  );
}
