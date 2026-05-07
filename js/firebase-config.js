// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (any name; e.g. "morse-mine")
// 3. In Project Overview, click the </> (Web) icon to register a web app
// 4. Copy the firebaseConfig object Firebase gives you and PASTE IT BELOW,
//    replacing the placeholders.
// 5. In the left sidebar, go to Build → Realtime Database → Create Database
//    - Choose a location (closest to you)
//    - Start in TEST MODE (you can lock down rules later if needed)
// 6. Done. The game will work immediately.
//
// SECURITY NOTE: These config values are PUBLIC by design (they're embedded in
// the page anyway). What protects your database is the Realtime Database
// security rules. For classroom use, test mode is fine.
// ============================================================================

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyA3OdzV0bNjtved4fs1zRHoTKt58wizFGg",
  authDomain: "minegame-157b3.firebaseapp.com",
  projectId: "minegame-157b3",
  storageBucket: "minegame-157b3.firebasestorage.app",
  messagingSenderId: "838813081748",
  appId: "1:838813081748:web:ff649d5e311993df889481",
  measurementId: "G-GRH3RJRS6B"
};

// ============================================================================
// ADMIN PASSWORD
// ============================================================================
// Anyone who knows this password can access the admin panel and create teams.
// Change this to something only you know. It's not military-grade security
// (it's checked client-side), but it keeps curious students out of admin.
// ============================================================================

window.ADMIN_PASSWORD = "captain1912";
