// ANMOL SINDH | Static Hosting Configuration for GitHub Pages
// Set your admin username, password, and optional cloud services here.
window.APP_CONFIG = {
  // Admin credentials for static login
  adminUsername: "admin",
  adminEmail: "raorashid.anmol@gmail.com",
  // Default password requested: Pakistani1 (you can change it anytime here or in the admin panel)
  adminPassword: "Pakistani1",
  recoveryCode: "ANMOL-9988-SECURE",

  // Hosting mode:
  // false = GitHub Pages (pure client-side static hosting without Node.js backend)
  // true = full-stack Node.js server with Express backend
  useBackend: false,

  // Optional: Cloud integration (Firebase / Supabase) if configured
  firebase: null,
  supabase: null,

  siteName: "ANMOL SINDH | انمول سنڌ",
  version: "2.1.0"
};
