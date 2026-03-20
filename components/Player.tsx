"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { nextTrack, prevTrack, togglePlayPause } from "@/redux/musicSlice";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat, 
  Heart,
  Mic2,
  ListMusic,
  MonitorSpeaker,
  Grid
} from "lucide-react";

export default function Player() {
  const dispatch = useDispatch<any>();
  const { tracks, currentIndex, isPlaying } = useSelector((state: RootState) => (state as any).music);
  const currentTrack = tracks[currentIndex];
  
  // const [isPlaying, setIsPlaying] = useState(false); // Replaced with Redux
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = useCallback(() => {
    dispatch(togglePlayPause());
  }, [dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => setCurrentTime(audioRef.current!.currentTime);
      const handleLoadedMetadata = () => setDuration(audioRef.current!.duration);
      const handleEnded = () => dispatch(nextTrack());

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [dispatch, currentTrack]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-50">
      <audio ref={audioRef} src={currentTrack.audio} />

      {/* Progress bar — full width on mobile, sits above controls */}
      <div className="md:hidden px-4 pt-2">
        <div className="relative w-full group">
          <input 
            type="range" 
            min={0} 
            max={duration || 0} 
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-spotify-green hover:accent-spotify-green"
          />
        </div>
      </div>

      {/* Main player row */}
      <div className="h-20 md:h-24 px-3 md:px-4 flex items-center justify-between gap-2">
        {/* Current Track Info */}
        <div className="flex items-center gap-2 md:gap-4 w-[45%] md:w-[30%] min-w-0">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0 shadow-lg group relative">
            {currentTrack.album_image || currentTrack.image ? (
              <img 
                src={currentTrack.album_image || currentTrack.image} 
                alt={currentTrack.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                <Grid className="w-5 h-5 md:w-6 md:h-6 text-zinc-600" />
              </div>
            )}
          </div>
          <div className="flex flex-col truncate min-w-0">
            <span className="text-white text-xs md:text-sm font-semibold truncate hover:underline cursor-pointer">
              {currentTrack.name}
            </span>
            <span className="text-zinc-400 text-[10px] md:text-xs truncate hover:underline cursor-pointer">
              {currentTrack.artist_name}
            </span>
          </div>
          <Heart className="hidden sm:block w-4 h-4 text-zinc-400 hover:text-white cursor-pointer ml-1 flex-shrink-0" />
        </div>

        {/* Center Controls */}
        <div className="flex flex-col items-center flex-1 md:max-w-[40%] w-full gap-1 md:gap-2">
          <div className="flex items-center gap-4 md:gap-6">
            <Shuffle className="hidden md:block w-4 h-4 text-zinc-500 hover:text-white cursor-pointer" />
            <SkipBack 
              className="w-5 h-5 text-white fill-current cursor-pointer hover:scale-110 transition-transform" 
              onClick={() => dispatch(prevTrack())}
            />
            <button 
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-current" />
              ) : (
                <Play className="w-5 h-5 text-black fill-current ml-0.5" />
              )}
            </button>
            <SkipForward 
              className="w-5 h-5 text-white fill-current cursor-pointer hover:scale-110 transition-transform"
              onClick={() => dispatch(nextTrack())}
            />
            <Repeat className="hidden md:block w-4 h-4 text-zinc-500 hover:text-white cursor-pointer" />
          </div>
          
          {/* Progress — desktop only (mobile has the top bar) */}
          <div className="hidden md:flex items-center gap-2 w-full max-w-xl">
            <span className="text-[10px] text-zinc-500 min-w-[30px] text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 group">
               <input 
                  type="range" 
                  min={0} 
                  max={duration || 0} 
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-spotify-green hover:accent-spotify-green range-thumb-none"
               />
            </div>
            <span className="text-[10px] text-zinc-500 min-w-[30px]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Right Controls — hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 w-[30%] justify-end">
          <Mic2 className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer" />
          <ListMusic className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer" />
          <MonitorSpeaker className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer" />
          <div className="flex items-center gap-2 w-24">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <div className="h-1 bg-zinc-800 rounded-full flex-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-white h-full w-[70%]" />
            </div>
          </div>
        </div>

        {/* Mobile: time display only */}
        <div className="md:hidden flex-shrink-0 text-right">
          <span className="text-[10px] text-zinc-500">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
