const ICON_MAP = {
  'castle': 'icons/castle.png',
  'rampart': 'icons/rampart.png',
  'tower': 'icons/tower.png',
  'inferno': 'icons/inferno.png',
  'necropolis': 'icons/necropolis.png',
  'dungeon': 'icons/dungeon.png',
  'stronghold': 'icons/stronghold.png',
  'fortress': 'icons/fortress.png',
  'conflux': 'icons/conflux.png',
  'cove': 'icons/cove.png',
  'factory': 'icons/factory.png',
  'bulwark': 'icons/bulwark.png',
};

const cityToIcon = (name) => {
  const key = name.trim().toLowerCase();
  return ICON_MAP[key] || 'icons/default.png';
};

const evtSource = new EventSource('/events');

evtSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const template = document.getElementById('template-name');
  const p1Name = document.getElementById('p1-name');
  const p2Name = document.getElementById('p2-name');
  const p1Hero = document.getElementById('p1-hero');
  const p2Hero = document.getElementById('p2-hero');
  const p1Icon = document.getElementById('p1-icon');
  const p2Icon = document.getElementById('p2-icon');
  const p1Color = document.getElementById('p1-color');
  const p2Color = document.getElementById('p2-color');
  const p1Rating = document.getElementById('p1-rating');
  const p2Rating = document.getElementById('p2-rating');
  const p1Gold = document.getElementById('p1-gold');
  const p2Gold = document.getElementById('p2-gold');

  if (!data.inGame) {
    template.textContent = 'No game in progress';
    p1Name.textContent = '';
    p2Name.textContent = '';
    p1Hero.textContent = '';
    p2Hero.textContent = '';
    p1Icon.src = 'icons/default.png';
    p2Icon.src = 'icons/default.png';
    p1Color.className = 'color-badge';
    p2Color.className = 'color-badge';
    p1Gold.textContent = '';
    p2Gold.textContent = '';
    return;
  }

  template.textContent = data.template || '';
  p1Name.textContent = data.player1.name || '';
  p2Name.textContent = data.player2.name || '';
  p1Rating.textContent = data.player1.rating ? ' (' + data.player1.rating + ')' : '';
  p2Rating.textContent = data.player2.rating ? ' (' + data.player2.rating + ')' : '';

  const h1 = data.player1.hero;
  p1Hero.textContent = (h1 ? h1 : '');
  const h2 = data.player2.hero;
  p2Hero.textContent = (h2 ? h2 : '');

  const c1 = data.player1.city || '';
  p1Icon.src = cityToIcon(c1);
  const c2 = data.player2.city || '';
  p2Icon.src = cityToIcon(c2);

  const col1 = (data.player1.color || '').toLowerCase();
  p1Color.className = 'color-badge' + (col1 ? ' ' + col1 : '');
  const col2 = (data.player2.color || '').toLowerCase();
  p2Color.className = 'color-badge' + (col2 ? ' ' + col2 : '');

  const g1 = data.player1.gold;
  if (g1 > 0) { p1Gold.textContent = '-' + g1; p1Gold.className = 'gold negative'; }
  else if (g1 < 0) { p1Gold.textContent = '+' + Math.abs(g1); p1Gold.className = 'gold positive'; }
  else { p1Gold.textContent = ''; p1Gold.className = 'gold'; }

  const g2 = data.player2.gold;
  if (g2 > 0) { p2Gold.textContent = '-' + g2; p2Gold.className = 'gold negative'; }
  else if (g2 < 0) { p2Gold.textContent = '+' + Math.abs(g2); p2Gold.className = 'gold positive'; }
  else { p2Gold.textContent = ''; p2Gold.className = 'gold'; }
};
