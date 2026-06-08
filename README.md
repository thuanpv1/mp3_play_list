# 🎵 MP3 Playlist Player

A simple and elegant Next.js web application for playing MP3 files with favorite management and auto-play features.

## ✨ Features

1. **📋 Display MP3 Playlist** - Automatically scans and displays all MP3 files from the `public/music` folder
2. **❤ Favorite Toggle** - Toggle favorite/unfavorite status for each song with a heart icon
3. **⭐ Favorites Filter** - View only your favorite songs with a dedicated favorites view
4. **▶ Audio Player** - Built-in player with:
   - Play/Pause controls
   - Progress bar with timeline seeking
   - Current time and duration display
   - Previous/Next track buttons
5. **🔄 Auto-Play Next** - Automatically plays the next song when current song finishes
6. **💾 Persistent Storage** - Favorites are saved to a JSON file and persist across sessions

## 🛠 Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: JSON file system
- **Audio**: HTML5 Audio API

## 📁 Project Structure

```
mp3_play_list/
├── app/
│   ├── api/
│   │   ├── songs/route.ts
│   │   └── favorites/route.ts
│   ├── components/
│   │   ├── AudioPlayer.tsx
│   │   ├── SongItem.tsx
│   │   └── Playlist.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts
│   └── musicScanner.ts
├── public/music/              # Add your MP3 files here
└── data/favorites.json        # Auto-created
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Add MP3 Files
Place your MP3 files in `public/music` folder

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 How to Use

1. **Add Songs**: Place MP3 files in `public/music` folder
2. **Play**: Click on any song to play it
3. **Control**: Use Play/Pause, Previous/Next buttons
4. **Seek**: Drag the progress bar to change position
5. **Favorite**: Click the heart icon to toggle favorite status
6. **Filter**: View only favorite songs with the "❤ Yêu thích" tab
7. **Auto-Play**: Next song plays automatically when current finishes

## 📦 API Endpoints

- `GET /api/songs` - Get all songs
- `GET /api/favorites` - Get favorite songs
- `PUT /api/favorites/[fileName]` - Toggle favorite status

## 💾 Data

Favorites are stored in `data/favorites.json` and persist across sessions.

## 🐛 Troubleshooting

**Songs not showing?**
- Check that MP3 files are in `public/music`
- Reload the page

**Favorites not saving?**
- Ensure `data` folder exists and has write permissions

---

**Enjoy your music! 🎶**
