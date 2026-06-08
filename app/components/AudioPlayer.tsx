'use client';

import { useEffect, useRef, useState } from 'react';
import { Song } from '@/lib/musicScanner';

interface AudioPlayerProps {
  currentSong: Song | null;
  onNext: () => void;
  onPrevious: () => void;
}

export default function AudioPlayer({
  currentSong,
  onNext,
  onPrevious,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // When song changes, update the audio source
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.path;
      setCurrentTime(0);
      // Reset playing state when changing song, user must click play
      if (isPlaying) {
        // If was playing, try to continue playing
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onNext]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Play failed:', error);
              setIsPlaying(false);
            });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
        <p className="text-lg">Chọn một bài hát để phát</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
      <h2 className="text-3xl font-bold mb-2 truncate">{currentSong.title}</h2>
      <p className="text-sm opacity-90 mb-6">{currentSong.fileName}</p>

      {/* Audio element */}
      <audio ref={audioRef} />

      {/* Timeline */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-2 text-white">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={onPrevious}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
        >
          ⏮ Trước
        </button>
        <button
          onClick={togglePlay}
          className="bg-white text-blue-600 font-bold py-2 px-8 rounded-lg hover:bg-gray-200 transition-all text-lg"
        >
          {isPlaying ? '⏸ Tạm dừng' : '▶ Phát'}
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
        >
          Tiếp ⏭
        </button>
      </div>
    </div>
  );
}
