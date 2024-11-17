import './App.css';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ArtStudio from './components/ArtStudio';
import Gallery from './components/Gallery';

function App() {
  // sets state for where a user is logged in or not
  const [user, setUser] = useState(null);
  // Tracks the current view: 'welcome', 'login', 'artistStudio', 'gallery'
  const [view, setView] = useState('welcome');

  
  // When the auth state is changed (as triggered via the login/sign up/logout component methods), update the user & view states
  useEffect(() => {
    // subscribe to the auth state change listener, and store the unsub function (returned from calling onAuthStateChanged)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { 
        setUser(currentUser); // Update the user state with the currentUser object (null if logged out)
        if (currentUser) {
          setView('artistStudio'); // Sets the state that enables automatically going to the artist studio if logged in
        } else {
            setView('welcome'); // Sets state that enables returning to the welcome screen on logout
        }
    });
    return () => unsubscribe(); // Turn off the onAuthStateChanged listener (i.e. unsubscribe from it) when app component unmounts (e.g. browser refresh, app shutdown, routed to another page)
  }, []);

   // Handle navigation
   const handleEnterArtistStudio = () => {
    setView('login'); // Switch to login/signup view
  };

  const handleVisitGallery = () => {
      setView('gallery'); // Placeholder for future Three.js scene
  };

  // Load specific html blocks based on the view state
  return (
    <div className="app-parent-div">
        {view === 'welcome' && (
            <div className="entrance-holder">
                <span className="small-header">WELCOME</span>
                <div className="welcome-options">
                    <button onClick={handleVisitGallery}>Visit Gallery</button>
                    <button onClick={handleEnterArtistStudio}>Enter Artist Studio</button>
                </div>
            </div>
        )}

        {view === 'login' && (
            <div className="entrance-holder">
                <button className="small-header back-button" onClick={ () => setView('welcome') }>&#8592;  BACK</button>
                { /* <SignUp /> */ }
                <Login />
            </div>
        )}

        {view === 'artistStudio' && user && (
            <ArtStudio />
        )}

        {view === 'gallery' && (
            <Gallery />
            // <div className="entrance-holder">
            //     <button className="small-header back-button" onClick={ () => setView('welcome') }>&#8592;  BACK</button>
            //     <h2>Gallery Coming Soon...</h2>
            //     {/* Placeholder for Three.js scene */}
            // </div>
        )}
    </div>
  );
};


export default App;
