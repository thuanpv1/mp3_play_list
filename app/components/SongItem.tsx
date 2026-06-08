'use client';

import { Song } from '@/lib/musicScanner';
import { useState } from 'react';

interface SongItemProps {
  song: Song;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => Promise<void>;
}

export default function SongItem({
  song,
  isPlaying,
  onPlay,
  onToggleFavorite,
}: SongItemProps) {
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoadingFavorite(true);
    try {
      await onToggleFavorite(song);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <div
      onClick={() => onPlay(song)}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isPlaying
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isPlaying && <span className="text-xl">▶</span>}
            <h3 className="font-semibold truncate">{song.title}</h3>
          </div>
          <p className={`text-sm truncate mt-1 ${isPlaying ? 'text-blue-100' : 'text-gray-500'}`}>
            {song.fileName}
          </p>
        </div>
        <button
          onClick={handleToggleFavorite}
          disabled={isLoadingFavorite}
          className={`ml-4 text-2xl transition-transform hover:scale-110 ${
            song.isFavorite
              ? 'text-red-500'
              : isPlaying
              ? 'text-white opacity-60 hover:opacity-100'
              : 'text-gray-400 hover:text-red-500'
          }`}
          title={song.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        >
          {song.isFavorite ? '❤' : '🤍'}
        </button>
      </div>
    </div>
  );
}
