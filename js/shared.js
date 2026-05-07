// ============================================================================
// SHARED UTILITIES (loaded by all pages)
// ============================================================================

// ---- Firebase init (uses compat libraries loaded in HTML) -------------------
firebase.initializeApp(window.FIREBASE_CONFIG);
const db = firebase.database();

window.MM = {
  db,
  refs: {
    teams:   db.ref('teams'),
    games:   db.ref('games'),
    results: db.ref('results'),
  }
};

// ---- Game constants ---------------------------------------------------------
window.MM.GRID_SIZE     = 10;     // 10x10 grid
window.MM.MAX_HEALTH    = 100;
window.MM.DAMAGE_PER_HIT = 25;
window.MM.MINE_COUNT    = 8;
window.MM.MORSE = {
  N: '-•',     S: '•••',    E: '•',      W: '•--'
};
window.MM.MORSE_FULL = {
  A: '•-',    B: '-•••',  C: '-•-•',  D: '-••',   E: '•',
  F: '••-•',  G: '--•',   H: '••••',  I: '••',    J: '•---',
  K: '-•-',   L: '•-••',  M: '--',    N: '-•',    O: '---',
  P: '•--•',  Q: '--•-',  R: '•-•',   S: '•••',   T: '-',
  U: '••-',   V: '•••-',  W: '•--',   X: '-••-',  Y: '-•--',  Z: '--••'
};
window.MM.DIR_NAMES = { N: 'NOORD', S: 'ZUID', E: 'OOST', W: 'WEST' };

// ---- Code generation --------------------------------------------------------
window.MM.generateCode = function (prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1 (ambiguous)
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${suffix}`;
};

// ---- Map generation (deterministic given a seed) ---------------------------
window.MM.makeRng = function (seedStr) {
  // Simple deterministic PRNG (mulberry32) seeded from a string
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  let a = h >>> 0;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

window.MM.generateMap = function (seed) {
  const rng = window.MM.makeRng(seed);
  const N = window.MM.GRID_SIZE;

  // Boat starts somewhere on bottom row, port on top row (random columns)
  const boat = { row: N - 1, col: Math.floor(rng() * N) };
  const port = { row: 0,     col: Math.floor(rng() * N) };

  // Generate mines, ensuring none overlap boat or port
  const mines = [];
  const taken = new Set([`${boat.row},${boat.col}`, `${port.row},${port.col}`]);
  let attempts = 0;
  while (mines.length < window.MM.MINE_COUNT && attempts < 200) {
    const r = Math.floor(rng() * N);
    const c = Math.floor(rng() * N);
    const key = `${r},${c}`;
    // Don't place mines adjacent to start (give the kids a chance!)
    const adjacentToStart = Math.abs(r - boat.row) <= 1 && Math.abs(c - boat.col) <= 1;
    if (!taken.has(key) && !adjacentToStart) {
      taken.add(key);
      mines.push({ row: r, col: c });
    }
    attempts++;
  }

  return { boat, port, mines, startBoat: { ...boat } };
};

// ---- Score formula (lower is better) ----------------------------------------
// score = elapsed seconds + (damage taken × 2)
window.MM.calculateScore = function (elapsedSec, damage) {
  return Math.round(elapsedSec + damage * 2);
};

// ---- Helpers ----------------------------------------------------------------
window.MM.formatTime = function (seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

window.MM.escapeHtml = function (str) {
  const div = document.createElement('div');
  div.innerText = String(str);
  return div.innerHTML;
};

// Lookup a team by its transmitter or receiver code.
// Resolves to { teamId, role, team } where role is 'transmitter' | 'receiver'.
window.MM.findTeamByCode = async function (code) {
  const upper = code.trim().toUpperCase();
  const snap = await window.MM.refs.teams.once('value');
  const teams = snap.val() || {};
  for (const [teamId, team] of Object.entries(teams)) {
    if (team.transmitterCode === upper) return { teamId, role: 'transmitter', team };
    if (team.receiverCode    === upper) return { teamId, role: 'receiver',    team };
  }
  return null;
};
