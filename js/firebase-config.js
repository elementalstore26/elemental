import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

// =========================
// Firebase Config
// =========================

const firebaseConfig = {
  apiKey: import.meta?.env?.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: "elemental-shop-91a92.firebaseapp.com",
  projectId: "elemental-shop-91a92",
  storageBucket: "elemental-shop-91a92.firebasestorage.app",
  messagingSenderId: "568140908799",
  appId: "1:568140908799:web:899982660f74e080ff64ca",
  measurementId: "G-1MFQVZZBSK"
};

// =========================
// Init App
// =========================

const app = initializeApp(firebaseConfig);

// =========================
// Analytics (Optional)
// =========================

let analytics;

try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Analytics not supported:", e);
}

export { app, analytics };