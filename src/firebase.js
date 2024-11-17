// Initializes a Firebase app instance using the configuration you provide.
// It's the entry point to interact with Firebase services (e.g., authentication, Firestore, storage);
import { initializeApp } from 'firebase/app';
// Initializes and returns the Firebase Authentication service for the app.
// It allows you to handle user authentication operations like login, sign-up, and logout.
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpDHNdkF12eCTW3D5W1FgkF0_KkOHqN4c",
    authDomain: "ai-gallery-55b8b.firebaseapp.com",
    projectId: "ai-gallery-55b8b",
    storageBucket: "ai-gallery-55b8b.appspot.com",
    messagingSenderId: "1047560914198",
    appId: "1:1047560914198:web:a99e37dc0bac88f7423c37",
    measurementId: "G-J6VRHFYEET"
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
