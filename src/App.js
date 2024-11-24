import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ArtStudio from './components/ArtStudio';
import Gallery from './components/Gallery';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function App() {
    // sets state for where a user is logged in or not
    const [user, setUser] = useState(null);
    // // Tracks the current view: 'welcome', 'login', 'artistStudio'
    const [view, setView] = useState('welcome');
    // Initialize db
    const db = getFirestore();

    // // When the auth state is changed (as triggered via the login/sign up/logout component methods), update the user & view states
    // useEffect(() => {
    // // subscribe to the auth state change listener, and store the unsub function (returned from calling onAuthStateChanged)
    // const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { 
    //     setUser(currentUser); // Update the user state with the currentUser object (null if logged out)
    //     // if there is a currentUser logged in
    //     if (currentUser) {
    //         // get the user's details from db
    //         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    //         // if the user's details exist in db, update the state with the user's easily parsable data object
    //         if (userDoc.exists()) {
    //             setUser({
    //                 uid: currentUser.uid, // Firebase Auth UID
    //                 ...userDoc.data()
    //             }); // Load user data into state
    //         } else {
    //             console.error('User not found in Firestore.');
    //         }
    //         // And navigate to the artist studio
    //         setView('artistStudio');
    //     } else {
    //         setView('welcome'); // Otherwise, stay on the welcome view
    //     }
    // });
    // return () => unsubscribe(); // Turn off the onAuthStateChanged listener (i.e. unsubscribe from it) when app component unmounts (e.g. browser refresh, app shutdown, routed to another page)
    // }, []);

    // Listen for Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch user details from Firestore
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUser({
                        uid: currentUser.uid, // Firebase UID
                        ...userDoc.data(), // Firestore fields
                    });
                    setView('artistStudio'); // Navigate to the studio on login
                } else {
                    console.error('User not found in Firestore.');
                }
            } else {
                setUser(null); // No user logged in
                setView('welcome'); // Navigate to the welcome screen
            }
        });
        return () => unsubscribe(); // Cleanup listener
    }, [db]);


    // Redirect to Login if user is not logged in
    const RedirectToLogin = () => {
        const navigate = useNavigate();
        useEffect(() => {
            navigate('/login'); // Redirect to login page
        }, [navigate]);
        return null;
    };

    // Render components based on the view state
    const renderView = () => {
        switch (view) {
            case 'welcome':
                return (
                    <div className="entrance-holder">
                        <span className="small-header">WELCOME</span>
                        <div className="welcome-options">
                            <button onClick={() => setView('login')}>Enter Studio</button>
                            <button onClick={() => setView('signup')}>Sign-up</button>
                            <button onClick={() => window.location.href = '/g/shimin'}>Visit Gallery</button>
                        </div>
                    </div>
                );
            case 'login':
                return <Login setUser={setUser} setView={setView}  />;
            case 'signup':
                return <SignUp setView={setView} />;
            case 'artistStudio':
                return user ? <ArtStudio user={user} /> : <p>Loading...</p>;
            default:
                return <p>Invalid View</p>;
        }
    };

    return (
        <Router>
            <div className="app-parent-div">
    
                <Routes>
                    {/* Dynamic Gallery Route */}
                    <Route path="/g/:slug" element={<Gallery />} />
                    {/* Non-Gallery Routes */}
                    <Route
                        path="/"
                        element={
                            <div className="app-parent-div">
                                {renderView()}
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );

    // // Handle navigation
    // const handleEnterArtistStudio = () => {
    //     setView('login'); // Switch to login/signup view
    // };
    // const handleEnterSignUp = () => {
    //     setView('signup'); // Switch to login/signup view
    // };
    // const handleVisitGallery = () => {
    //     setView('gallery'); // Placeholder for future Three.js scene
    // };

    // Load specific html blocks based on the view state
    // return (
    //     <Router>
    //         <div className="app-parent-div">
    //             <Routes>
    //                 {/* Welcome Screen */}
    //                 <Route path="/" element={<WelcomeScreen />} />

    //                 {/* Sign Up */}
    //                 <Route path="/signup" element={<SignUp />} />

    //                 {/* Login */}
    //                 <Route path="/login" element={<Login setUser={setUser} />} />

    //                 {/* Artist Studio */}
    //                 <Route path="/studio" element={user ? <ArtStudio user={user} /> : <RedirectToLogin />} />

    //                 {/* Dynamic Gallery Route */}
    //                 <Route path="/g/:slug" element={<Gallery />} />

    //                 {/* {view === 'welcome' && (
    //                     <div className="entrance-holder">
    //                         <span className="small-header">WELCOME</span>
    //                         <div className="welcome-options">
    //                             <button onClick={handleVisitGallery}>Visit Gallery</button>
    //                             <button onClick={handleEnterArtistStudio}>Enter Artist Studio</button>
    //                             <button onClick={handleEnterSignUp}>Sign-up as an Artist</button>
    //                         </div>
    //                     </div>
    //                 )}

    //                 {view === 'login' && (
    //                     <div className="entrance-holder">
    //                         <button className="small-header back-button" onClick={ () => setView('welcome') }>&#8592;  BACK</button>
    //                         <Login setUser={setUser} />
    //                     </div>
    //                 )}

    //                 {view === 'signup' && (
    //                     <div className="entrance-holder">
    //                         <button className="small-header back-button" onClick={ () => setView('welcome') }>&#8592;  BACK</button>
    //                         <SignUp />
    //                     </div>
    //                 )}

    //                 {view === 'artistStudio' && user && (
    //                     <ArtStudio user={user} />
    //                 )}

    //                 {view === 'gallery' && (
    //                     <Gallery />
    //                 )} */}
    //             </Routes>
    //         </div>
    //     </Router>
    // );
};



export default App;
