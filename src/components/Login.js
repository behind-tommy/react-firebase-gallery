// Users can log in using their email and password. On successful login:
    // Fetch the associated user data from Firestore.
    // Store user data in the global state for session management.

// Imports React which is necessary to use components, and useState to manage state (storing email, password, etc)
import React, { useState } from 'react';
// A firebase auth function that enables sign-in with email and password
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Login = ({ setUser, setView }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   // Initialise db
   const db = getFirestore();

    // This triggers when the user submits the sign-up form.
   const handleLogin = async (e) => {
        // prevents page reload
       e.preventDefault();
       try {
            // signs in with the email & password state values, and store the userId
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Fetch user data from Firestore, from the users collection with id userId
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUser(userDoc.data()); // Set global user state
                alert('Login successful! Welcome back to your studio.');
                console.log(userId);
            } else {
                throw new Error('User data not found in Firestore.');
            }

            alert('Logged in successfully!');
       } catch (err) {
           setError(err.message);
       }
   };

   return (
        <div className="entrance-holder">
            <button className="small-header back-button" onClick={ () => setView('welcome') }>&#8592;  BACK</button>
            <div className="login-form-holder">
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Artist Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Enter Studio</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Login;
