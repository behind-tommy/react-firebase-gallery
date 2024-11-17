import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ArtStudio from './components/ArtStudio';
import SignUp from './components/SignUp';
import Login from './components/Login';

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [view, setView] = useState('welcome'); // Tracks the current view: 'welcome', 'login', 'artistStudio', 'gallery'

    const auth = getAuth();

    // Listen to authentication state changes
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                setView('artistStudio'); // Automatically go to the artist studio if logged in
            } else {
                setView('welcome'); // Return to the welcome screen on logout
            }
        });
        return () => unsubscribe();
    }, [auth]);

    // Handle navigation
    const handleEnterArtistStudio = () => {
        setView('login'); // Switch to login/signup view
    };

    const handleVisitGallery = () => {
        setView('gallery'); // Placeholder for future Three.js scene
    };

    return (
        <div>
            {view === 'welcome' && (
                <div className="welcome-screen">
                    <h1>Welcome!</h1>
                    <div className="options">
                        <button onClick={handleVisitGallery}>Visit Gallery</button>
                        <button onClick={handleEnterArtistStudio}>Enter Artist Studio</button>
                    </div>
                </div>
            )}

            {view === 'login' && (
                <div className="auth-screen">
                    <h2>Sign Up or Log In</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <SignUp />
                        <Login />
                    </div>
                </div>
            )}

            {view === 'artistStudio' && currentUser && (
                <ArtStudio />
            )}

            {view === 'gallery' && (
                <div className="gallery-screen">
                    <h2>Gallery Coming Soon...</h2>
                    {/* Placeholder for Three.js scene */}
                </div>
            )}
        </div>
    );
};

export default App;
