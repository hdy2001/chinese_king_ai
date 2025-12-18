import React, { useState, useRef, useEffect } from 'react';
import { IconMusic, IconMusicOff } from './Icons';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Use local music file
  const MUSIC_URL = "/music.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set low volume for background ambiance
      
      // Auto-play on mount
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          console.log("宫廷雅乐已自动开启");
        })
        .catch(e => {
          // Autoplay might be blocked by browser policy
          console.log("自动播放被浏览器阻止，需手动开启:", e);
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Audio playback requires user interaction first in most browsers
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.log("Autoplay prevented or failed:", e);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center">
      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} type="audio/mpeg" />
      </audio>
      
      <button 
        onClick={togglePlay}
        className={`p-2 rounded-full border transition-all duration-300 shadow-lg ${
          isPlaying 
            ? 'bg-[#8B0000] text-[#FFD700] border-[#FFD700] opacity-80 hover:opacity-100 animate-pulse-slow' 
            : 'bg-[#2c1810] text-[#8b6b4e] border-[#5c3a21] opacity-40 hover:opacity-100'
        }`}
        title={isPlaying ? "暂停雅乐" : "播放雅乐"}
      >
        {isPlaying ? <IconMusic className="w-5 h-5" /> : <IconMusicOff className="w-5 h-5" />}
      </button>
      
      {/* Tooltip style label */}
      <span className="text-[10px] text-[#5c3a21] mt-1 font-serif opacity-0 hover:opacity-100 transition-opacity select-none">
        宫廷雅乐
      </span>
    </div>
  );
};