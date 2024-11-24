import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Used to extract the gallery URL slug from the URL and pass it as a global var for gallery-scripts.js to use
import { gsap } from 'gsap'; // Import GSAP directly
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import './gallery.css'; // Import the gallery styles

// Attach GSAP to the global window object
window.gsap = gsap;

// Gallery component loaded when "visit gallery" is clicked
function Gallery() {
    const { slug } = useParams(); // Extract the slug from the URL
    const [galleryData, setGalleryData] = useState({ name: '', artistName: '' }); // State to hold gallery data
    const [isLoading, setIsLoading] = useState(true); // Track loading state (of gallery & artist data pull from db). Shifted to false on completion.

    const db = getFirestore();

    // On component mount, load the gallery script. Remove the gallery html and script when unmounted, to avoid mem leak
    useEffect(() => {

        /**
         * Step 1: Make the slug globally accessible.
         * Why? Because `gallery-scripts.js` operates outside React's component lifecycle.
         * By assigning the slug to a global variable (`window.gallerySlug`), the script can use it.
         */
        window.gallerySlug = `/g/${slug}`;

        /**
         * Step 2: Dynamically load the gallery script.
         * Why? Loading the script dynamically ensures that it is only loaded when the `Gallery` component is mounted.
         * This reduces unnecessary overhead when the gallery view is not active.
         */
        const script = document.createElement('script');
        script.src = '/gallery-scripts.js'; // Path to gallery-scripts.js
        script.type = 'module'; // Specify it as an ES Module
        script.async = true; // Load asynchronously
        document.body.appendChild(script);
        console.log(`gallery-scripts.js loaded for slug: /g/${slug}`);

        // Fetch gallery data from Firestore
        const fetchGalleryAndArtist = async () => {
            try {
                // Query the galleries collection to get gallery details
                const galleryQuery = query(
                    collection(db, 'galleries'),
                    where('defaultGalleryUrl', '==', `/g/${slug}`)
                );
                const gallerySnapshot = await getDocs(galleryQuery);

                if (gallerySnapshot.empty) {
                    console.error('Gallery not found!');
                    setGalleryData({ name: 'Unknown Gallery', artistName: 'Unknown Artist' });
                    setIsLoading(false); // Stop loading even if not found
                    return;
                }

                const galleryDoc = gallerySnapshot.docs[0].data();
                const userId = galleryDoc.artistId; // Assuming galleryDoc includes userId

                // Fetch artist name from the users collection
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);

                const artistName = userDoc.exists() ? userDoc.data().artistName : 'Unknown Artist';

                // Update state with gallery and artist details
                setGalleryData({
                    name: galleryDoc.name || 'Untitled Gallery',
                    artistName,
                });
            } catch (error) {
                console.error('Error fetching gallery or artist data:', error);
                setGalleryData({ name: 'Error Loading Gallery', artistName: 'Error' });
            } finally {
                setIsLoading(false); // Stop loading after fetching
            }
        };
        
        fetchGalleryAndArtist();
    
        /**
         * Step 3: Cleanup when the component unmounts.
         * Why? Prevent memory leaks or stale data. If the `Gallery` component is unmounted,
         * we remove the script and delete the global `gallerySlug` variable.
         */
        return () => {
            delete window.gallerySlug;  
        };
      }, [slug, db]);


    // Track changes in galleryData for debugging
    useEffect(() => {
        console.log("Updated galleryData:", galleryData);
    }, [galleryData]);

    return (
        <div>
            { /* <!-- Welcome Overlay --> */ }
            <div id="welcomeOverlay">
                {isLoading ? (
                    <div className="loader-container">
                        <div className="loader">...</div> {/* Circular Loader */}
                    </div>
                ) : (
                    <div id="welcomeText">
                        Welcome to {galleryData.name} by {galleryData.artistName}
                    </div>
                )}
            </div>
            
            { /* <!-- Gallery --> */ }
            <div id="gallery"></div>


            { /* <!-- Mobile joystick --> */ }
            <div id="joystick-container">
                <div id="joystick-base">
                    <div id="joystick-handle"></div>
                </div>
            </div>
            
            { /* <!-- Chat --> */ }
            <div id="chat-overlay" className="hidden">
                <div id="chat-title-section">
                    <img id="chat-close-btn" src="/img/close.svg" />
                    <img id="chat-visitor-pp" src="/img/agents.png" />
                    <div id="chat-visitor-info">
                        <span id="chat-title">Agent S</span>
                        <span id="chat-subtitle">Gallery Visitor</span>
                    </div>
                </div>
                <div id="chat-content">
                    <div id="chat-messages">
                        <div id="" className="chat-message visitor-message">
                            <span>Visitor Message</span>
                        </div>
                        <div id="" className="chat-message user-message">
                            <span>User Message</span>
                        </div>
                    </div>
                </div>
                <div id="chat-input">
                    <textarea id="user-chat-input" placeholder="Type your message and hit enter"></textarea>
                </div>
            </div>

            { /* <!-- Artwork Desc Overlay --> */ }
            <div id="artwork-desc-overlay" className="hidden">
                <div className="overlay-content">
                    <img id="artwork-desc-close-btn" src="/img/close.svg" />
                    <h2 id="artwork-title"></h2>
                    <p id="artist-name">Shimin</p>
                    <p id="artwork-description"></p>
                </div>
            </div>
            
        </div>
    );
}

export default Gallery;
