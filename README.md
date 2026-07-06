# Twitch HotA API Overlay

Real-time HoMM 3 HotA overlay for Twitch streamers, powered by [hotameta.com](https://hotameta.com/) API.

Shows in your stream: template name, both players with town icons, hero names, ratings, and gold trade.

![screenshot](Screenshot%202026-07-06%20213341.png)

## Requirements

- [Node.js](https://nodejs.org/) (v18+)
- An active [HotA](https://hota.io/) account with a public lobby profile on hotameta.com

## Setup

1. **Create `config.json`** in the project folder:
   ```json
   {
     "streamer_name": "YourHotAName"
   }
   ```
   Replace `YourHotAName` with your actual HotA in-game username (the one shown on hotameta.com).

2. **Install dependencies** (one time):
   ```
   npm install
   ```

3. **Start the server**:
   - Double-click `start.bat`, or
   - Run `npm start` in a terminal

4. **Add to OBS**:
   - Add a new **Browser** source
   - URL: `http://localhost:3000`
   - Width: 520, Height: 80
   - Enable "Refresh browser when source becomes active"

## Usage

The overlay auto-detects when you enter a game by polling `https://hotameta.com/api/lobby/player/YOURNAME` every 10 seconds.

When no game is active, it shows "No game in progress". It updates automatically when a new match starts.

## Stop the Server

- Double-click `stop.bat`, or
- Press `Ctrl+C` in the terminal where the server is running

## Configuration

All settings in `config.json`:

| Key | Default | Description |
|-----|---------|-------------|
| `streamer_name` | (required) | Your HotA in-game username |
| `poll_interval` | `10` | API poll interval in seconds |

Or set via environment variable `STREAMER_NAME`.

## Files

```
├── server.js          Express server + API polling + SSE
├── start.bat          Double-click to start
├── stop.bat           Double-click to stop
├── package.json
├── config.json        Your streamer name (create this)
├── public/
│   ├── index.html     Overlay layout
│   ├── style.css      Overlay styling
│   ├── script.js      SSE consumer
│   └── icons/         Town icon images
└── README.md
```
