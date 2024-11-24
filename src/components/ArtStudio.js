import React, { useState, useEffect } from 'react';
// Import ability to handle signout
import { auth } from '../firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth';
// Import ability to interact with the DB, to fetch and handle user-specific data
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
// Import sub-components
import ArtSpacesList from './ArtSpacesList';
import ArtDetails from './ArtDetails';

// Define overall layout of the art studio (2 child components and a logout option)
const ArtStudio = ({user}) => {
    // Track the current art space selected, which is used to control the details shown in the ArtDetails component
    // setSelectedSpaceId is called in ArtSpacesList.js, when a space is clicked
    const [selectedSpaceId, setSelectedSpaceId] = useState(null);
    // State for art spaces data for the user
    const [artSpaces, setArtSpaces] = useState([]);
    // State for gallery data of the logged in user
    const [gallery, setGallery] = useState({ name: '', url: '' });
    // States for gallery & artist details * settings state
    const [artistName, setArtistName] = useState(user?.artistName || 'My Artist Name');
    const [settingsOpen, setSettingsOpen] = useState(false);
    // States for view / edit state
    const [isEditingGalleryName, setIsEditingGalleryName] = useState(false);
    const [isEditingGalleryUrl, setIsEditingGalleryUrl] = useState(false);
    const [isEditingArtistName, setIsEditingArtistName] = useState(false);
    // States for new gallery/artist details
    const [newGalleryName, setNewGalleryName] = useState('');
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [newArtistName, setNewArtistName] = useState('');
    // Store updated art data (used to update the tile of the uploaded art, in the ArtSpacesList component).
    const [updatedArt, setUpdatedArt] = useState({});
    
    // Initialize db
    const db = getFirestore();
    
    // Updates the updatedArt state. This function is passed through ArtDetails and called in the ArtUpload component.
    const handleArtUpload = (spaceId, artUrl) => {
        setUpdatedArt({ spaceId, artUrl }); // Track the updated spaceId and URL
    };

    // Fetch gallery details & art space data for the logged in user
    useEffect(() => {
        const fetchGalleryAndSpaces = async () => {
            if (!user) return;
    
            try {
                // Get the gallery object linked to this user
                const galleryDoc = await getDoc(doc(db, 'galleries', user.defaultGalleryId));
                // Set states for Gallery data, gallery name, gallery URL
                if (galleryDoc.exists()) {
                    const galleryData = galleryDoc.data();
                    setGallery({ name: galleryData.name, url: galleryData.defaultGalleryUrl });
                    setNewGalleryName(galleryData.name);
                    setNewGalleryUrl(galleryData.defaultGalleryUrl.split('/').pop());
                }
                // Get art spaces and set state
                const q = query(
                    collection(db, 'spaces'),
                    where('galleryId', '==', user.defaultGalleryId)
                );
                const querySnapshot = await getDocs(q);
                const spaces = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setArtSpaces(spaces);
                console.log(artSpaces);
            } catch (error) {
                console.error('Error fetching gallery and art spaces:', error);
            }
        };

        fetchGalleryAndSpaces();

    }, [user]);

    console.log(user);

    // Handle changes to gallery name
    const saveGalleryName = async () => {
        try {
            await updateDoc(doc(db, 'galleries', user.defaultGalleryId), { name: newGalleryName });
            setGallery((prev) => ({ ...prev, name: newGalleryName }));
            setIsEditingGalleryName(false);
            alert('Gallery name updated!');
        } catch (error) {
            console.error('Error updating gallery name:', error);
        }
    };

    // Handle changes to gallery URL
    const saveGalleryUrl = async () => {
        try {
            // check DB for existing gallery URLs and block if a match is found
            const newUrl = `/g/${newGalleryUrl}`;
            const q = query(
                collection(db, 'galleries'),
                where('defaultGalleryUrl', '==', newUrl)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert('This gallery URL is already taken. Please choose another.');
                return;
            }

            // Otherwise, update the defaultGalleryUrl to the newUrl and update states
            await updateDoc(doc(db, 'galleries', user.defaultGalleryId), { defaultGalleryUrl: newUrl });
            setGallery((prev) => ({ ...prev, url: newUrl }));
            setIsEditingGalleryUrl(false);
            alert('Gallery URL updated!');
        } catch (error) {
            console.error('Error updating gallery URL:', error);
        }
    };

    // Handle changes to artist name
    const saveArtistName = async () => {
        try {
            console.log(user);
            await updateDoc(doc(db, 'users', user.uid), { artistName: newArtistName });
            setArtistName(newArtistName);
            setIsEditingArtistName(false);
            alert('Artist name updated!');
        } catch (error) {
            console.error('Error updating artist name:', error);
        }
    };

    // log out function (called when logout button is clicked)
    const handleLogout = async () => {
        await signOut(auth);
        alert('Logged out successfully!');
    };

    // Render logout, artspaceslist and art details
    return (
        <div>
            <div className="header-nav">
                {/* on click, call handleLogout */}
                <span className="art-studio-header-name">Artist Studio</span>
                <button className="settings-button" onClick={() => setSettingsOpen(!settingsOpen)}><img src="img/settings.png"></img></button>
                <button className="art-studio-logout" onClick={handleLogout}>Exit</button>
            </div>

            {/* Gallery Settings Section */}
            {settingsOpen && (
                <div className="settings-view">
                    <h3>Settings</h3>
                    
                    {/* Artist Name */}
                    <div>
                        <label className='art-studio-label'>Artist Name</label>
                        {isEditingArtistName ? (
                            <div>
                                
                                <button className="settings-edit-button" onClick={saveArtistName}>Save</button>
                                <button className="settings-edit-button" onClick={() => setIsEditingArtistName(false)}>Cancel</button>
                                <input
                                        type="text"
                                        value={newArtistName}
                                        onChange={(e) => setNewArtistName(e.target.value)}
                                    />
                            </div>
                        ) : (
                            <div>
                                <button className="settings-edit-button" onClick={() => setIsEditingArtistName(true)}>Edit</button>
                                <span>{artistName}</span>
                            </div>
                        )}
                    </div>

                    {/* Gallery Name */}
                    <div>
                        <label className='art-studio-label'>Gallery Name</label>
                        {isEditingGalleryName ? (
                            <div>
                                <button className="settings-edit-button" onClick={saveGalleryName}>Save</button>
                                <button className="settings-edit-button" onClick={() => setIsEditingGalleryName(false)}>Cancel</button>
                                <input
                                    type="text"
                                    value={newGalleryName}
                                    onChange={(e) => setNewGalleryName(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div>
                                <button className="settings-edit-button" onClick={() => setIsEditingGalleryName(true)}>Edit</button>
                                <span>{gallery.name}</span>
                            </div>
                        )}
                    </div>


                    {/* Gallery URL */}
                    <div>
                        <label className='art-studio-label'>Gallery URL</label>
                        {isEditingGalleryUrl ? (
                            <div>
                                <button className="settings-edit-button" onClick={saveGalleryUrl}>Save</button>
                                <button className="settings-edit-button" onClick={() => setIsEditingGalleryUrl(false)}>Cancel</button>
                                <input
                                    type="text"
                                    value={newGalleryUrl}
                                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div>
                                <button className="settings-edit-button" onClick={() => setIsEditingGalleryUrl(true)}>Edit</button>
                                <a href={gallery.url} target="_blank" rel="noopener noreferrer">
                                    {gallery.url}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Art studio details */}
            <div className="art-studio-holder">
                <div className="art-details-holder">
                    <h2>Update Art Space</h2>      
                    {selectedSpaceId ? (
                        <ArtDetails spaceId={selectedSpaceId} onArtUpload={handleArtUpload} />
                    ) : (
                        <p>Select an artwork to view & update it   &#8594;</p>
                    )}
                </div>
                <div className="art-space-grid">
                    <h2>Select Art Space</h2>     
                    {/* onSelectSpace is a property (data/functions) passed to this component. The value passed is setSelectedSpaceId (the state updater function) */}
                    <ArtSpacesList onSelectSpace={setSelectedSpaceId} updatedArt={updatedArt} artSpaces={artSpaces} />
                </div>
                
            </div>
        </div>
    );
};

export default ArtStudio;
