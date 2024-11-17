// useEffect: useEffect: React hook to handle side effects like fetching data when the component is loaded or updated.
import React, { useState, useEffect } from 'react';
// getStorage: Initializes FB storage to interact with uploads. ref: Creates a ref to a file. uploadBytes: Uploads a file. 
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
// getFirestore: Initializes FS to interact with DB. doc: Creates reference to a DB document. setDoc: Write/Update doc in DB
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Accepts spaceId as a prop and renders/calls functions based on spaceId
const ArtUpload = ({ spaceId }) => {
    // state to store URL of uploaded file. This is used to render the image preview.
    const [artUrl, setArtUrl] = useState(null);
    // Initializes storage and DB (so I can interact with them)
    const storage = getStorage();
    const db = getFirestore();

    // Runs the fetchArt function whenever the spaceId changes, to update the state artUrl
    useEffect(() => {
        // function to fetch the current art file for the selected spaceId
        const fetchArt = async () => {
            try {
                // Creates a reference to the file with space ID = current spaceId (from the art/{spaceId} directory in Firebase Storage)
                // This is an object with key-values
                const artRef = ref(storage, `art/${spaceId}`);
                // Get the file URL and store it in url
                const url = await getDownloadURL(artRef);
                // Update the state of artURL to the current art file
                setArtUrl(url);
            } catch (error) {
                console.log('No art found:', error);
                // clear the component's art preview by clearing state
                setArtUrl(null)
            }
        };
        // Updates the artUrl state to the fetched URL, which will display the art preview.
        fetchArt();
        // Believe this indicates the useEffect function only triggers if spaceId changes
    }, [spaceId]);

    // Function called when user uplaods a file via the file upload input.
    const handleFileChange = async (e) => {
        // Retrieves the first selected file from the file input.
        const file = e.target.files[0];

        // Ensure the file has a .jpg extension when saved
        const fileName = `${spaceId}.jpg`; // Add the extension
        // Creates a ref to the existing file with space ID = current spaceId (from the art/{spaceId} directory in Firebase Storage)
        const artRef = ref(storage, `art/${fileName}`);
        // Will pass this to the upload function to indicate the content type explicity
        const metadata = {
            contentType: 'image/jpeg',
        };

        // creates a ref to the document in the DB - in the spaces collection, that corresponds to spaceId
        const docRef = doc(db, 'spaces', spaceId);

        try {
            // Delete the existing file if it exists (Looks like this deletes the file but maintains the reference object in Storage)
            await deleteObject(artRef);
        } catch (error) {
            console.log('No existing file to delete:', error);
        }

        // Upload the new file to the current artRef object
        await uploadBytes(artRef, file, metadata);
        // Get the new file URL and store it in url
        const url = await getDownloadURL(artRef);
        // Update the state to the new art URL
        setArtUrl(url);

        // If the document doesn’t exist, it will be created with the artUrl field on Firestore. Otherwise it'll be updated with the artUrl.
        // Also, if 'spaces' collection exists in Firestore, add the document here. If not, create the collection. This is indicated in const docRef above.
        // Merge: true - By default, calling setDoc replaces the entire document, meaning any fields not included in the new data will be removed from the document. Using the { merge: true } option changes this behavior. Instead of replacing the entire document, Firestore updates only the specified fields in the document while keeping any existing fields intact. This is called merging.
        await setDoc(docRef, { artUrl: url }, { merge: true });
    };

    return (
        <div className='art-upload-holder'>
            {artUrl ? (
                <img src={artUrl} alt="Art Preview" />
            ) : (
                <p>No art uploaded</p>
            )}
            <label className='art-studio-label'>Upload and Replace</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
    );
};

export default ArtUpload;
