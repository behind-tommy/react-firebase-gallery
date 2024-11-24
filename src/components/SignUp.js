// Users can sign up using their email and password. On successful signup:
    // Create a user in Firebase Authentication.
    // Create an associated document in the users collection in Firestore.
    // Create a default gallery document in the galleries collection.


// Imports React which is necessary to use components, and useState to manage state (storing email, password, etc)
import React, { useState } from 'react';
// A Firebase Authentication function that creates a new user account using an email and password.
import { createUserWithEmailAndPassword } from 'firebase/auth';
// The Firebase Authentication instance initialized in firebase.js
import { auth } from '../firebase';
// Firebase capabilities to interact with DB (on sign-up update the DB with user & gallerd documents)
import { getFirestore, doc, setDoc, collection, writeBatch } from 'firebase/firestore';

// Declares a functional React component named SignUp.
const SignUp = ({setView}) => {
    // Define state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Stores error messages if the sign-up process fails.
    
    // Initialize DB
    const db = getFirestore();

    // This triggers when the user submits the sign-up form.
    const handleSignUp = async (e) => {
        // Stops the form from refreshing the page.
        e.preventDefault();
        // Attempts to create the user.
        try {
            // createUserWithEmailAndPassword Returns a Promise:
            // await: Pauses the execution of handleSignUp until the Promise settles. If fulfilled, proceeds to the next line. If rejected, control jumps to the catch block.
            // Fulfilled: User creation is successful.Rejected: An error occurred (e.g., invalid email format).
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Store the user ID
            const userId = userCredential.user.uid;
            console.log('User created in Auth:', userId);

            // Create Firestore batch to perform multiple writes
            const batch = writeBatch(db);

            // Add user document
            batch.set(doc(db, 'users', userId), {
                email: email,
                defaultGalleryId: `gallery-${userId}`,
            });

            // Add default gallery document
            batch.set(doc(db, 'galleries', `gallery-${userId}`), {
                artistId: userId,
                defaultGalleryUrl: `/artist-gallery-${userId}`,
                name: 'My Gallery',
            });

            // Add default artSpaces (24 spaces)
            for (let i = 1; i <= 24; i++) {
                const spaceId = `space${i}`;
                batch.set(doc(db, 'spaces', `${spaceId}-${userId}`), {
                artSpaceId: spaceId,
                galleryId: `gallery-${userId}`,
                artUrl: '',
                title: '',
                description: '',
                });
            }

            // Commit the batch
            await batch.commit();

            alert('Signed-up!');
        } catch (err) {
            // updates error state with error message
            setError(err.message);
        }
    };

    // Render the Sign-up UI
    return (
        <div className="entrance-holder">
            <button className="small-header back-button" onClick={ () => setView('welcome') }>&#8592;  BACK</button>
            <div className="login-form-holder">
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
        </div>
    );
};

export default SignUp;
