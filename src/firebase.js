// Initializes a Firebase app instance using the configuration you provide.
// It's the entry point to interact with Firebase services (e.g., authentication, Firestore, storage);
import { initializeApp } from 'firebase/app';
// Initializes and returns the Firebase Authentication service for the app.
// It allows you to handle user authentication operations like login, sign-up, and logout.
import { getAuth } from 'firebase/auth';

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

// This initializes Firebase Authentication using the app instance.
// The auth object allows you to perform authentication tasks, like signing in users, managing user sessions, etc.
// Exports the auth object so it can be used in other parts of your application, such as your login or signup components.
export const auth = getAuth(app);

// This exports the initialized app instance as the default export of the file.
// Other files can import this app instance to access Firebase services if needed (e.g., Firestore, Storage).
export default app;
