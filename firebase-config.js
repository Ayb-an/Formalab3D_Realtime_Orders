// ---------------------------------------------------------------
// FormaLab3d: shared database settings
//
// 1. Go to https://console.firebase.google.com and create a project (free Spark plan is enough).
// 2. Build > Firestore Database > Create database (start in test mode while setting up).
// 3. Project settings > General > "Your apps" > add a Web app (</>) and copy the config below.
// 4. Paste the values over the placeholders.
//
// While apiKey still says YOUR_API_KEY the pages run in LOCAL TEST MODE:
// data is saved only in that browser, nothing is shared.
//
// Suggested Firestore rules once everything works (Firestore > Rules):
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{db}/documents {
//       match /{document=**} { allow read, write: if true; }
//     }
//   }
// (Open access. Anyone who finds your site's config could edit data. If you want it
//  locked down, add Firebase Authentication and require request.auth != null.)
// ---------------------------------------------------------------
export const firebaseConfig = {
  apiKey: "AIzaSyC3GvpiXt4Jx1TVleKtm0aDY9AGvLdZ5I8",
  authDomain: "formalab3d-7c0d6.firebaseapp.com",
  projectId: "formalab3d-7c0d6",
  storageBucket: "formalab3d-7c0d6.firebasestorage.app",
  messagingSenderId: "423007754462",
  appId: "1:423007754462:web:7d8ad556e41e4052c4ca4f"
};
