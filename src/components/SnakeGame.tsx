import { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE } from '../constants';
import { RotateCcw, Trophy } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  speed: number;
}

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame({ speed }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Use ref to keep track of latest direction to prevent quick double-turn self-collisions
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    generateFood(INITIAL_SNAKE);
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const currentDir = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    directionRef.current = direction;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) setHighScore(newScore);
          generateFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, score, highScore, speed, generateFood]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl relative">
      {/* Score Header - Absolutely positioned to act like the App top right header on desktop */}
      <div className="md:fixed top-10 right-10 flex gap-8 md:gap-12 text-right z-50">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-pink-500 font-bold mb-1">Current Score</p>
          <p className="text-5xl md:text-6xl font-black tabular-nums leading-none">{String(score).padStart(4, '0')}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-1 flex items-center justify-end gap-1"><Trophy className="w-3 h-3" /> High Score</p>
          <p className="text-5xl md:text-6xl font-black tabular-nums leading-none opacity-30">{String(highScore).padStart(4, '0')}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative aspect-square w-full">
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative w-full h-full bg-black rounded-3xl border-4 border-slate-900 flex items-center justify-center p-4">
          <div 
            className="grid gap-[2px] w-full h-full opacity-20 border border-white/5"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              let cellClass = "bg-white/5 border-[0.5px] border-white/5 w-full h-full"; // Empty cell overlay base

              return <div key={`bg-${index}`} className={cellClass} />;
            })}
          </div>

          <div 
            className="absolute inset-4 grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
            }}
          >
             {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              let cellClass = "w-full h-full"; // empty

              if (isHead) {
                cellClass = "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] rounded-sm z-10 w-full h-full";
              } else if (isBody) {
                // Calculate opacity for snake body fade effect
                const bodyIndex = snake.findIndex(seg => seg.x === x && seg.y === y);
                const opacity = Math.max(0.2, 0.8 - (bodyIndex * 0.05));
                cellClass = "bg-cyan-400 rounded-sm w-full h-full shrink-0";
                return <div key={`fg-${index}`} className={cellClass} style={{opacity}} />;
              } else if (isFood) {
                cellClass = "bg-pink-500 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.8)] animate-pulse w-full h-full scale-75";
              }

              return <div key={`fg-${index}`} className={cellClass} />;
            })}
          </div>
        
          {/* Overlays */}
          {(gameOver || isPaused) && (
            <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-widest">
                    System Error
                  </h2>
                  <p className="text-slate-400 font-medium tracking-wide mb-6 text-xs uppercase">Collision detected.</p>
                  <div className="text-3xl font-black text-pink-500 mb-8 tabular-nums">
                    {String(score).padStart(4, '0')}
                  </div>
                </>
              ) : (
                <h2 className="text-4xl font-black text-cyan-400 mb-8 uppercase tracking-widest">
                  Paused
                </h2>
              )}
              
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-white text-black text-[10px] hover:bg-slate-200 font-bold flex items-center justify-center gap-2 rounded-full transition-all uppercase tracking-widest border-4 border-white/20 hover:border-white/40"
              >
                <RotateCcw className="w-4 h-4" />
                {gameOver ? "Reboot Sequence" : "Resume Sequence"}
              </button>
              <p className="text-slate-500 text-[10px] mt-6 tracking-widest font-mono uppercase opacity-50">Press SPACE to play</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="flex gap-4 text-[10px] font-mono text-slate-500 tracking-widest mt-2 uppercase">
        <span>[W][A][S][D] / Arrows : Control Vector</span>
        <span className="opacity-50">|</span>
        <span>[SPACE] : {gameOver ? 'Restart' : isPaused ? 'Resume' : 'Pause'} Thread</span>
      </div>
    </div>
  );
}
