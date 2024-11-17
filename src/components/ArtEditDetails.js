import React, { useState, useEffect } from 'react';
// getFirestore: Initializes FS to interact with DB. doc: Creates reference to a DB document. setDoc: Write/Update doc in DB
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';


const ArtEditDetails = ({ spaceId }) => {
    // states for title and description
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // initialise the DB
    const db = getFirestore();

    // When spaceId changes, trigger the function fetchDetails to update the states for title & desc to that of the new spaceId's art
    useEffect(() => {
        const fetchDetails = async () => {
            // Get reference to the document of the current spaceId in the spaces collection
            const docRef = doc(db, 'spaces', spaceId);
            // Firestore method to get a snapshot of the document and its data fields (e.g. { title:b, desc:d , artUrl:e})
            const docSnap = await getDoc(docRef);
            // This specifically checks if the document referenced by docRef exists in Firestore.
            if (docSnap.exists()) {
                // Extracts the document's fields into a plain JavaScript object.
                const data = docSnap.data();
                // updates the title & desc states with the document data
                setTitle(data.title || '');
                setDescription(data.description || '');
            } else {
                setTitle(''); // Reset to empty if no document exists
                setDescription('');
            }
        };
        fetchDetails();
    }, [spaceId]);

    // function called when save button is clicked - to write the changes of title/desc to the DB
    const handleSave = async () => {
        // Get reference to the document of the current spaceId in the spaces collection
        const docRef = doc(db, 'spaces', spaceId);
        // Update the title and description fields for this referenced document with the current state values
        await setDoc(docRef, { title, description }, { merge: true });
        alert('Details saved!');
    };

    // When the value of input changes (user types/backspaces), auto-update the state of title and description to have it reflect the current text
    // When save is clicked, call handleSave
    return (
        <div className='art-edit-details-holder'>
            <label className='art-studio-label'>Art Title</label>
            <input
                type="text"
                placeholder="Art Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <label className='art-studio-label'>Art Description</label>
            <textarea
                id="art-desc-textarea"
                placeholder="Art Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default ArtEditDetails;
