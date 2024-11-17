// Imports React which is necessary to use components, and useState to manage state (storing email, password, etc)
import React, { useState } from 'react';
// A Firebase Authentication function that creates a new user account using an email and password.
import { createUserWithEmailAndPassword } from 'firebase/auth';
// The Firebase Authentication instance initialized in firebase.js
import { auth } from '../firebase';

// Declares a functional React component named SignUp.
const SignUp = () => {
    // Define state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Stores error messages if the sign-up process fails.

    // This triggers when the user submits the sign-up form.
    const handleSignUp = async (e) => {
        // Stops the form from refreshing the page.
        e.preventDefault();
        // Attempts to create the user.
        try {
            // createUserWithEmailAndPassword Returns a Promise:
            // await: Pauses the execution of handleSignUp until the Promise settles. If fulfilled, proceeds to the next line. If rejected, control jumps to the catch block.
            // Fulfilled: User creation is successful.Rejected: An error occurred (e.g., invalid email format).
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User created successfully!');
        } catch (err) {
            // updates error state with error message
            setError(err.message);
        }
    };

    // Render the Sign-up UI
    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignUp;
