import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrev: () => void;
  onVolumeChange: (vol: number) => void;
}

export function MusicPlayer({
  currentTrackIndex,
  isPlaying,
  volume,
  onPlayPause,
  onSkipNext,
  onSkipPrev,
  onVolumeChange
}: MusicPlayerProps) {
  const track = TRACKS[currentTrackIndex];

  return (
    <div className="bg-slate-900/50 border-t border-white/10 h-32 px-6 md:px-10 flex items-center gap-6 md:gap-12 w-full">
      
      {/* Controls */}
      <div className="flex items-center gap-4 md:gap-6 shrink-0">
        <button 
          onClick={onSkipPrev}
          className="opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <SkipBack className="w-5 h-5 md:w-6 md:h-6 fill-current" />
        </button>
        
        <button 
          onClick={onPlayPause}
          className="w-10 h-10 md:w-14 md:h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 md:w-8 md:h-8 fill-current" />
          ) : (
            <Play className="w-5 h-5 md:w-8 md:h-8 fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={onSkipNext}
          className="opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <SkipForward className="w-5 h-5 md:w-6 md:h-6 fill-current" />
        </button>
      </div>

      {/* Track Info & Progress */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex justify-between items-end mb-2">
           <div className="min-w-0 pr-4">
             <p className="text-sm md:text-2xl font-bold leading-tight truncate">{track.title.toUpperCase()}</p>
             <p className="text-[10px] sm:text-xs font-mono text-cyan-400 truncate">{track.artist.toUpperCase()}</p>
           </div>
           {/* Simulate time */}
           <div className="hidden sm:flex text-[10px] font-mono tracking-widest text-slate-400 shrink-0">
              00:00 / {track.duration}
           </div>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          {/* Mock progress bar that animates slowly when playing */}
          <div className={`h-full bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full transition-all duration-1000 ease-linear ${isPlaying ? 'w-[45%]' : 'w-[45%]'}`}></div>
        </div>
      </div>

      {/* Volume (Takes the place of the visualizer on right side) */}
      <div className="hidden md:flex w-32 items-center gap-3 shrink-0 opacity-50 focus-within:opacity-100 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onVolumeChange(volume === 0 ? 0.5 : 0)}
          className="focus:outline-none"
        >
          {volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
             <Volume2 className="w-5 h-5" />
          )}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
        />
      </div>
    </div>
  );
}
