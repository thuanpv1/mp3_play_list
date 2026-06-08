import fs from 'fs';
import path from 'path';

const FAVORITES_FILE = path.join(process.cwd(), 'data', 'favorites.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize favorites file if it doesn't exist
function initializeFavoritesFile() {
  ensureDataDir();
  if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify([]));
  }
}

export function getFavorites(): string[] {
  initializeFavoritesFile();
  try {
    const data = fs.readFileSync(FAVORITES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function toggleFavorite(fileName: string): boolean {
  initializeFavoritesFile();
  const favorites = getFavorites();
  const index = favorites.indexOf(fileName);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(fileName);
  }
  
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
  return index === -1; // Return true if added, false if removed
}

export function isFavorite(fileName: string): boolean {
  return getFavorites().includes(fileName);
}
