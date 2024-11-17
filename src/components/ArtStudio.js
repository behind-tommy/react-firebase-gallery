import React, { useState } from 'react';
// Import ability to handle signout
import { auth } from '../firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth';
// Import sub-components
import ArtSpacesList from './ArtSpacesList';
import ArtDetails from './ArtDetails';

// Define overall layout of the art studio (2 child components and a logout option)
const ArtStudio = () => {
    // key state to handle is the current art space selected, which is used to control the details shown in the ArtDetails component
    // setSelectedSpaceId is called in ArtSpacesList.js, when a space is clicked
    const [selectedSpaceId, setSelectedSpaceId] = useState(null);

    // log out function (called when logout button is clicked)
    const handleLogout = async () => {
        await signOut(auth);
        alert('Logged out successfully!');
    };

    // Render logout, artspaceslist and art details
    return (
        <div className="art-studio-holder" style={{ display: 'flex', height: '100vh' }}>
            <div className="header-nav">
                {/* on click, call handleLogout */}
                <span className="art-studio-header-name">Artist Studio</span>
                <button className="art-studio-logout" onClick={handleLogout}>Exit Studio</button>
            </div>
            <div className="art-details-holder">
                <h2>Update Art Space {selectedSpaceId}</h2>      
                {selectedSpaceId ? (
                    <ArtDetails spaceId={selectedSpaceId} />
                ) : (
                    <p>Select an artwork to view & update it   &#8594;</p>
                )}
            </div>
            <div className="art-space-grid">
                <h2>Select Art Space</h2>     
                {/* onSelectSpace is a property (data/functions) passed to this component. The value passed is setSelectedSpaceId (the state updater function) */}
                <ArtSpacesList onSelectSpace={setSelectedSpaceId} />
            </div>
            
        </div>
    );
};

export default ArtStudio;
