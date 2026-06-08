import fs from 'fs';
import path from 'path';

const MUSIC_DIR = path.join(process.cwd(), 'public', 'music');

export interface Song {
  id: string;
  fileName: string;
  title: string;
  path: string;
  isFavorite: boolean;
}

export async function scanMusicFiles(): Promise<Song[]> {
  try {
    // Ensure music directory exists
    if (!fs.existsSync(MUSIC_DIR)) {
      fs.mkdirSync(MUSIC_DIR, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(MUSIC_DIR);
    const mp3Files = files.filter(file => 
      file.toLowerCase().endsWith('.mp3')
    );

    return mp3Files.map(file => ({
      id: file, // Using fileName as ID since it should be unique
      fileName: file,
      title: file.replace(/\.mp3$/i, ''),
      path: `/music/${encodeURIComponent(file)}`,
      isFavorite: false, // Will be set by API
    }));
  } catch (error) {
    console.error('Error scanning music files:', error);
    return [];
  }
}
