// Initializes a Firebase app instance using the configuration you provide.
// It's the entry point to interact with Firebase services (e.g., authentication, Firestore, storage);
import { initializeApp } from 'firebase/app';
// Initializes and returns the Firebase Authentication service for the app.
// It allows you to handle user authentication operations like login, sign-up, and logout.
import { getAuth, connectAuthEmulator  } from 'firebase/auth';
// Emulators
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
// The app object now represents the connection to Firebase.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// If run on local, use the emulator instead of prod DB
if (window.location.hostname === "localhost") {
  // Connect to Firestore Emulator
  connectFirestoreEmulator(db, "localhost", 8081);
  // Connect to Auth Emulator (if using authentication)
  connectAuthEmulator(auth, "http://localhost:9099");
  // Connect to Storage emulator
  connectStorageEmulator(storage, 'localhost', 9199);

}

// This initializes Firebase Authentication using the app instance.
// The auth object allows you to perform authentication tasks, like signing in users, managing user sessions, etc.
// Exports the auth object so it can be used in other parts of your application, such as your login or signup components.
export { db, auth, storage };

// This exports the initialized app instance as the default export of the file.
// Other files can import this app instance to access Firebase services if needed (e.g., Firestore, Storage).
export default app;
