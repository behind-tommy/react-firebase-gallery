import React, { useEffect } from 'react';
import { gsap } from 'gsap'; // Import GSAP directly
import './gallery.css'; // Import the gallery styles

// Attach GSAP to the global window object
window.gsap = gsap;

// Gallery component loaded when "visit gallery" is clicked
function Gallery() {

    // On component mount, load the gallery script. Remove the gallery html and script when unmounted, to avoid mem leak
    useEffect(() => {
        // Dynamically load the gallery script
        const script = document.createElement('script');
        script.src = '/gallery-scripts.js'; // Path to your gallery-scripts.js
        script.type = 'module'; // Specify it as an ES Module
        script.async = true; // Load asynchronously
        document.body.appendChild(script);

        console.log('gallery-scripts.js has been loaded.');
    
        return () => {
          // Cleanup logic
        //   document.getElementById('gallery')?.remove();
        //   console.log('Gallery component unmounted.');
        };
      }, []);

  return (
    <div>
        { /* <!-- Welcome Overlay --> */ }
        <div id="welcomeOverlay">
            <div id="welcomeText">Welcome to the Gallery of Beeb</div>
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
                <img id="chat-close-btn" src="./img/close.svg" />
                <img id="chat-visitor-pp" src="./img/agents.png" />
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
                <img id="artwork-desc-close-btn" src="./img/close.svg" />
                <h2 id="artwork-title"></h2>
                <p id="artist-name">Shimin</p>
                <p id="artwork-description"></p>
            </div>
        </div>
        
    </div>
  );
}

export default Gallery;
