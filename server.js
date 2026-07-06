const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
} catch (_) {}

const STREAMER = config.streamer_name || process.env.STREAMER_NAME;
if (!STREAMER) {
  console.error('Error: streamer_name not set. Create config.json with {"streamer_name":"YourName"} or set STREAMER_NAME env var.');
  process.exit(1);
}
const POLL_INTERVAL = (config.poll_interval || 10) * 1000;
const API_URL = `https://hotameta.com/api/lobby/player/${STREAMER}`;

const gameState = {
  template: '',
  opponent: '',
  player1: { name: '', city: '', hero: '', color: '', gold: 0, rating: 0 },
  player2: { name: '', city: '', hero: '', color: '', gold: 0, rating: 0 },
  inGame: false
};

let sseClients = [];
let lastSessionId = null;

const sseBroadcast = () => {
  const data = JSON.stringify(gameState);
  sseClients.forEach(res => res.write(`data: ${data}\n\n`));
};

const fetchApi = () => {
  https.get(API_URL, { headers: { 'Accept': 'application/json' } }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.ok || !data.in_game) {
          if (gameState.inGame) {
            gameState.inGame = false;
            gameState.template = '';
            gameState.opponent = '';
            gameState.player1 = { name: '', city: '', hero: '', color: '', gold: 0, rating: 0 };
            gameState.player2 = { name: '', city: '', hero: '', color: '', gold: 0, rating: 0 };
            sseBroadcast();
          }
          return;
        }

        const g = data.game;
        if (g.session_id === lastSessionId) return;
        lastSessionId = g.session_id;

        const picks = g.picks || g;
        const p1 = picks.p1;
        const p2 = picks.p2;

        const normalizeCity = (factionName) => {
          const map = {
            'castle': 'castle', 'rampart': 'rampart', 'tower': 'tower',
            'inferno': 'inferno', 'necropolis': 'necropolis', 'dungeon': 'dungeon',
            'stronghold': 'stronghold', 'fortress': 'fortress', 'conflux': 'conflux',
            'cove': 'cove', 'factory': 'factory', 'citadel': 'citadel',
            'bulwark': 'bulwark', 'haven': 'factory'
          };
          return map[(factionName || '').toLowerCase()] || (factionName || '').toLowerCase();
        };

        const trade1 = p1.trade || 0;
        const trade2 = p2.trade || 0;

        gameState.inGame = true;
        gameState.template = picks.template || '';
        gameState.opponent = g.p2_name || '';
        gameState.player1 = {
          name: g.p1_name || '',
          city: normalizeCity(p1.faction_name),
          hero: p1.hero_name || '',
          color: p1.color_name || '',
          gold: -trade1,
          rating: g.p1_rating || 0
        };
        gameState.player2 = {
          name: g.p2_name || '',
          city: normalizeCity(p2.faction_name),
          hero: p2.hero_name || '',
          color: p2.color_name || '',
          gold: -trade2,
          rating: g.p2_rating || 0
        };

        sseBroadcast();
      } catch (e) {
        console.error('Parse error:', e.message);
      }
    });
  }).on('error', (e) => {
    console.error('Fetch error:', e.message);
  });
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  sseClients.push(res);
  res.write(`data: ${JSON.stringify(gameState)}\n\n`);
  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Polling ${API_URL} every ${POLL_INTERVAL / 1000}s`);
  fetchApi();
  setInterval(fetchApi, POLL_INTERVAL);
});
