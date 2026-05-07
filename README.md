# ⚓ Morse Mine — Naval Telegraph Game

A two-screen classroom game that teaches kids Morse code and the basics of telecommunication. One team plays the **Navigator** (sees the sea chart with hidden mines), the other plays the **Operator** (steers the boat). Between them, only Morse code on a real telegraph device.

The web game handles everything except the Morse transmission itself — that part happens on your physical telegraph hardware.

![Two-screen layout](https://via.placeholder.com/900x300/0a1929/b08d57?text=Navigator+Chart+%E2%9A%93+%7C+%7C+%E2%96%A3+Operator+Sonar)

---

## How a round works

1. **Admin** creates a team in the admin panel → gets two codes (Transmitter + Receiver).
2. **Navigator** opens the game on PC #1, enters the **TX-XXXX** code → sees the full sea chart with the boat (red), the port (anchor), and the hidden mines.
3. **Operator** opens the game on PC #2, enters the **RX-XXXX** code → sees a phosphor-green sonar display: only the boat, the port, and detonated mines.
4. The Navigator looks at the chart and decides which way the boat should go. They tell the team's **Morse sender** to transmit `N`, `S`, `E`, or `W`.
5. The Morse sender taps it on the physical telegraph.
6. The team's **Morse decoder** writes down the letter and tells the Operator.
7. The Operator presses the corresponding direction. The boat moves.
8. **Both screens update in real time.** If the boat hits a mine, it takes 25 damage and the mine becomes visible on the operator's sonar.
9. Reach the port = victory. Take 100 damage = sunk. Score is added to the leaderboard.

**Score formula:** `seconds_elapsed + (damage × 2)` — lower is better.

---

## Setup (about 5 minutes)

### 1. Set up a free Firebase project (for live sync between the two PCs)

1. Go to https://console.firebase.google.com and sign in with any Google account.
2. Click **Add project** → name it anything (e.g. `morse-mine`) → skip Analytics → Create.
3. On the project home page, click the **`</>`** (Web) icon to register a web app.
   - Give it any nickname (e.g. `morse-mine-web`)
   - **Don't** enable Firebase Hosting (we use GitHub Pages instead)
   - Click **Register app**
4. Firebase shows you a `firebaseConfig` object. **Copy it.**
5. In the left sidebar: **Build → Realtime Database → Create Database**
   - Pick the location nearest to you (`europe-west1` is good for the Netherlands)
   - Choose **Start in test mode** → Enable
6. Open `js/firebase-config.js` in this project and **paste** your config in place of the placeholders.
7. While you're there, **change `ADMIN_PASSWORD`** to something only you know.

> **About "test mode":** Test mode lets anyone with the database URL read/write for 30 days. For a classroom that's fine. If you want to keep using it longer, see "Securing the database" below.

### 2. Push to GitHub Pages

```bash
# Inside this folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/morse-mine-game.git
git push -u origin main
```

Then in your repo on github.com:
- Go to **Settings → Pages**
- Source: **Deploy from a branch** → branch `main` → folder `/ (root)`
- Save. After ~1 minute, it'll be live at `https://YOUR_USERNAME.github.io/morse-mine-game/`

### 3. Run a game

1. Open the live URL on **your laptop** → click `Admin` → enter your admin password.
2. Type a team name (e.g. `Sea Wolves`) → click **Generate Codes**.
3. Two codes appear: `TX-XXXX` (transmitter) and `RX-XXXX` (receiver).
4. Open the URL on **the navigator's PC** → enter the `TX-XXXX` code.
5. Open the URL on **the operator's PC** → enter the `RX-XXXX` code.
6. Players start moving. The first move starts the timer.

---

## Files

```
morse-mine-game/
├── index.html              ← Landing page (enter team code)
├── admin.html              ← Admin panel (create/manage teams)
├── transmitter.html        ← Navigator's full sea chart
├── receiver.html           ← Operator's CRT sonar + controls
├── leaderboard.html        ← Ranked teams
├── css/
│   └── styles.css          ← All styling
├── js/
│   ├── firebase-config.js  ← ⚠️ Edit this with your Firebase keys
│   └── shared.js           ← Game logic, map gen, helpers
└── README.md
```

---

## Customising the game

Open `js/shared.js`. Top of the file:

```js
window.MM.GRID_SIZE      = 10;   // Sea size — bigger = harder
window.MM.MAX_HEALTH     = 100;
window.MM.DAMAGE_PER_HIT = 25;   // How much damage a mine does
window.MM.MINE_COUNT     = 8;    // Hidden mines per game
```

Change any of these and push the change to GitHub. Each new game uses fresh mines.

To use **full words** instead of single letters (e.g. require kids to send `NORTH`, `SOUTH`, etc. for more Morse practice), open `transmitter.html` and `receiver.html` — the direction key is in HTML and easily extended. The internal logic is direction-agnostic, just adjust the displayed Morse table.

---

## Securing the database (optional)

After the 30-day test-mode window, the database stops accepting writes. To extend it without adding authentication, paste this into **Realtime Database → Rules**:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For real security (preventing students from poking at the data), you'd add Firebase Authentication and lock writes to authenticated users — overkill for a classroom but mentioned for completeness.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Connection failed. Is Firebase configured?" | `firebase-config.js` still has placeholder values, OR Realtime Database wasn't created. |
| Codes work but moves don't sync | Check that **Realtime Database** is enabled (not Firestore — they're different products in Firebase). |
| Admin login fails | You forgot to change `ADMIN_PASSWORD` in `firebase-config.js`, or you're using a different password. Default is `captain1912`. |
| Game won't start | The first **direction press** on the Operator side starts the timer — the Navigator can't start it. |
| Boat doesn't move when arrow keys pressed | Click anywhere on the Operator page first to give it keyboard focus. |
| GitHub Pages shows 404 | Wait 2-3 minutes after enabling Pages. Also check the URL has the trailing `/`. |

---

## Credits

Built for the classroom. Use freely. ⚓
