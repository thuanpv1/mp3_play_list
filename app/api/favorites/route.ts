import { NextRequest, NextResponse } from 'next/server';
import { scanMusicFiles } from '@/lib/musicScanner';
import { getFavorites } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const songs = await scanMusicFiles();
    const favoriteFileNames = getFavorites();
    
    const favoriteSongs = songs.filter(song => 
      favoriteFileNames.includes(song.fileName)
    ).map(song => ({
      ...song,
      isFavorite: true,
    }));

    return NextResponse.json(favoriteSongs);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json(
      { error: 'Failed to get favorites' },
      { status: 500 }
    );
  }
}
