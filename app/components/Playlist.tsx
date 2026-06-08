'use client';

import { useEffect, useState } from 'react';
import { Song } from '@/lib/musicScanner';
import AudioPlayer from './AudioPlayer';
import SongItem from './SongItem';

type ViewMode = 'all' | 'favorites';

export default function Playlist() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load all songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/songs');
        const data = await response.json();
        setSongs(data);
        if (data.length > 0 && !currentSong) {
          setCurrentSong(data[0]);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Load favorites
  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleToggleFavorite = async (song: Song) => {
    try {
      const response = await fetch(`/api/favorites/${encodeURIComponent(song.fileName)}`, {
        method: 'PUT',
      });
      const result = await response.json();

      // Update songs list
      setSongs(prevSongs =>
        prevSongs.map(s =>
          s.fileName === song.fileName
            ? { ...s, isFavorite: result.isFavorite }
            : s
        )
      );

      // Update current song if it's the one being toggled
      if (currentSong?.fileName === song.fileName) {
        setCurrentSong(prev => prev ? { ...prev, isFavorite: result.isFavorite } : null);
      }

      // Update favorites list
      await loadFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
  };

  const handleNext = () => {
    const displaySongs = viewMode === 'all' ? songs : favorites;
    if (!currentSong || displaySongs.length === 0) return;

    const currentIndex = displaySongs.findIndex(s => s.fileName === currentSong.fileName);
    const nextIndex = (currentIndex + 1) % displaySongs.length;
    setCurrentSong(displaySongs[nextIndex]);
  };

  const handlePrevious = () => {
    const displaySongs = viewMode === 'all' ? songs : favorites;
    if (!currentSong || displaySongs.length === 0) return;

    const currentIndex = displaySongs.findIndex(s => s.fileName === currentSong.fileName);
    const previousIndex = (currentIndex - 1 + displaySongs.length) % displaySongs.length;
    setCurrentSong(displaySongs[previousIndex]);
  };

  const displaySongs = viewMode === 'all' ? songs : favorites;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎵 MP3 Playlist</h1>
          <p className="text-gray-600">Phát nhạc và quản lý yêu thích của bạn</p>
        </div>

        {/* Player Section */}
        <div className="mb-8">
          <AudioPlayer
            currentSong={currentSong}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'all'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
            }`}
          >
            📋 Tất cả ({songs.length})
          </button>
          <button
            onClick={() => setViewMode('favorites')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              viewMode === 'favorites'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-red-500'
            }`}
          >
            ❤ Yêu thích ({favorites.length})
          </button>
        </div>

        {/* Songs List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Đang tải...</p>
            </div>
          ) : displaySongs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {viewMode === 'all'
                  ? 'Không có bài hát nào. Vui lòng thêm file MP3 vào thư mục public/music'
                  : 'Chưa có bài hát yêu thích'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {displaySongs.map(song => (
                <SongItem
                  key={song.fileName}
                  song={song}
                  isPlaying={currentSong?.fileName === song.fileName}
                  onPlay={handlePlaySong}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>💡 Hướng dẫn:</strong> Thêm file MP3 vào thư mục <code className="bg-white px-2 py-1 rounded text-red-600">public/music</code> để các bài hát hiển thị trong ứng dụng.
          </p>
        </div>
      </div>
    </div>
  );
}
