import { NextRequest, NextResponse } from 'next/server';
import { scanMusicFiles } from '@/lib/musicScanner';
import { getFavorites } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const songs = await scanMusicFiles();
    const favorites = getFavorites();
    
    const songsWithFavorites = songs.map(song => ({
      ...song,
      isFavorite: favorites.includes(song.fileName),
    }));

    return NextResponse.json(songsWithFavorites);
  } catch (error) {
    console.error('Error getting songs:', error);
    return NextResponse.json(
      { error: 'Failed to get songs' },
      { status: 500 }
    );
  }
}
